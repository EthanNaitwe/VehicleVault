import {
  users,
  vehicles,
  vehicleExpenses,
  type User,
  type InsertUser,
  type Vehicle,
  type InsertVehicle,
  type VehicleExpense,
  type InsertVehicleExpense,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicles(userId: number): Promise<Vehicle[]>;
  getVehicle(id: number, userId: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle, userId: number): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>, userId: number): Promise<Vehicle | undefined>;
  deleteVehicle(id: number, userId: number): Promise<boolean>;
  
  // Vehicle expense operations
  getVehicleExpenses(vehicleId: number, userId: number): Promise<VehicleExpense[]>;
  addVehicleExpense(expense: InsertVehicleExpense, userId: number): Promise<VehicleExpense>;
  
  // Analytics operations
  getVehicleStats(userId: number): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    soldThisMonth: number;
    totalRevenue: number;
    averageProfit: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private vehicles: Vehicle[] = [];
  private expenses: VehicleExpense[] = [];
  private nextUserId = 1;
  private nextVehicleId = 1;
  private nextExpenseId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      email: userData.email,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      password: userData.password,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Vehicle operations
  async getVehicles(userId: number): Promise<Vehicle[]> {
    return this.vehicles
      .filter(vehicle => vehicle.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getVehicle(id: number, userId: number): Promise<Vehicle | undefined> {
    return this.vehicles.find(vehicle => vehicle.id === id && vehicle.userId === userId);
  }

  async createVehicle(vehicleData: InsertVehicle, userId: number): Promise<Vehicle> {
    const vehicle: Vehicle = {
      id: this.nextVehicleId++,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      vin: vehicleData.vin ?? null,
      mileage: vehicleData.mileage ?? null,
      fuelType: vehicleData.fuelType ?? null,
      transmission: vehicleData.transmission ?? null,
      purchasePrice: vehicleData.purchasePrice ?? null,
      askingPrice: vehicleData.askingPrice ?? null,
      soldPrice: vehicleData.soldPrice ?? null,
      status: vehicleData.status ?? "available",
      description: vehicleData.description ?? null,
      imageUrl: vehicleData.imageUrl ?? null,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      soldAt: null,
    };
    this.vehicles.push(vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>, userId: number): Promise<Vehicle | undefined> {
    const index = this.vehicles.findIndex(vehicle => vehicle.id === id && vehicle.userId === userId);
    if (index === -1) return undefined;
    
    this.vehicles[index] = {
      ...this.vehicles[index],
      ...vehicleData,
      updatedAt: new Date(),
    };
    return this.vehicles[index];
  }

  async deleteVehicle(id: number, userId: number): Promise<boolean> {
    const index = this.vehicles.findIndex(vehicle => vehicle.id === id && vehicle.userId === userId);
    if (index === -1) return false;
    
    this.vehicles.splice(index, 1);
    return true;
  }

  // Vehicle expense operations
  async getVehicleExpenses(vehicleId: number, userId: number): Promise<VehicleExpense[]> {
    // First verify the vehicle belongs to the user
    const vehicle = await this.getVehicle(vehicleId, userId);
    if (!vehicle) {
      return [];
    }
    
    return this.expenses
      .filter(expense => expense.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  async addVehicleExpense(expenseData: InsertVehicleExpense, userId: number): Promise<VehicleExpense> {
    // Verify the vehicle belongs to the user
    const vehicle = await this.getVehicle(expenseData.vehicleId, userId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    const expense: VehicleExpense = {
      id: this.nextExpenseId++,
      vehicleId: expenseData.vehicleId,
      type: expenseData.type,
      amount: expenseData.amount,
      description: expenseData.description ?? null,
      date: expenseData.date ?? new Date(),
      createdAt: new Date(),
    };
    this.expenses.push(expense);
    return expense;
  }

  // Analytics operations
  async getVehicleStats(userId: number): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    soldThisMonth: number;
    totalRevenue: number;
    averageProfit: number;
  }> {
    const userVehicles = this.vehicles.filter(v => v.userId === userId);

    const totalVehicles = userVehicles.length;
    const availableVehicles = userVehicles.filter(v => v.status === "available").length;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const soldThisMonth = userVehicles.filter(v => 
      v.status === "sold" && v.soldAt && new Date(v.soldAt) >= startOfMonth
    ).length;

    const soldVehicles = userVehicles.filter(v => v.status === "sold" && v.soldPrice);
    const totalRevenue = soldVehicles.reduce((sum, v) => sum + parseFloat(v.soldPrice || "0"), 0);
    
    const totalProfit = soldVehicles.reduce((sum, v) => {
      const soldPrice = parseFloat(v.soldPrice || "0");
      const purchasePrice = parseFloat(v.purchasePrice || "0");
      return sum + (soldPrice - purchasePrice);
    }, 0);

    const averageProfit = soldVehicles.length > 0 ? totalProfit / soldVehicles.length : 0;

    return {
      totalVehicles,
      availableVehicles,
      soldThisMonth,
      totalRevenue,
      averageProfit,
    };
  }
}

export const storage = new MemStorage();
