import {
  users,
  vehicles,
  vehicleExpenses,
  type User,
  type UpsertUser,
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
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicles(userId: string): Promise<Vehicle[]>;
  getVehicle(id: number, userId: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle, userId: string): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>, userId: string): Promise<Vehicle | undefined>;
  deleteVehicle(id: number, userId: string): Promise<boolean>;
  
  // Vehicle expense operations
  getVehicleExpenses(vehicleId: number, userId: string): Promise<VehicleExpense[]>;
  addVehicleExpense(expense: InsertVehicleExpense, userId: string): Promise<VehicleExpense>;
  
  // Analytics operations
  getVehicleStats(userId: string): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    soldThisMonth: number;
    totalRevenue: number;
    averageProfit: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Vehicle operations
  async getVehicles(userId: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.userId, userId))
      .orderBy(desc(vehicles.createdAt));
  }

  async getVehicle(id: number, userId: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)));
    return vehicle;
  }

  async createVehicle(vehicle: InsertVehicle, userId: string): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicles)
      .values({ ...vehicle, userId })
      .returning();
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>, userId: string): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();
    return updatedVehicle;
  }

  async deleteVehicle(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)));
    return result.rowCount > 0;
  }

  // Vehicle expense operations
  async getVehicleExpenses(vehicleId: number, userId: string): Promise<VehicleExpense[]> {
    // First verify the vehicle belongs to the user
    const vehicle = await this.getVehicle(vehicleId, userId);
    if (!vehicle) {
      return [];
    }

    return await db
      .select()
      .from(vehicleExpenses)
      .where(eq(vehicleExpenses.vehicleId, vehicleId))
      .orderBy(desc(vehicleExpenses.date));
  }

  async addVehicleExpense(expense: InsertVehicleExpense, userId: string): Promise<VehicleExpense> {
    // Verify the vehicle belongs to the user
    const vehicle = await this.getVehicle(expense.vehicleId, userId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const [newExpense] = await db
      .insert(vehicleExpenses)
      .values(expense)
      .returning();
    return newExpense;
  }

  // Analytics operations
  async getVehicleStats(userId: string): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    soldThisMonth: number;
    totalRevenue: number;
    averageProfit: number;
  }> {
    const userVehicles = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.userId, userId));

    const totalVehicles = userVehicles.length;
    const availableVehicles = userVehicles.filter(v => v.status === "available").length;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const soldThisMonth = userVehicles.filter(v => 
      v.status === "sold" && v.soldAt && v.soldAt >= startOfMonth
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

export const storage = new DatabaseStorage();
