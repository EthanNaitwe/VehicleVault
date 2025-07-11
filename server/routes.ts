import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { insertVehicleSchema, insertVehicleExpenseSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes (handled in auth.ts)
  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const vehicles = await storage.getVehicles(userId);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id, userId);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const validation = insertVehicleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid vehicle data", 
          errors: fromZodError(validation.error).toString() 
        });
      }

      const vehicle = await storage.createVehicle(validation.data, userId);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.put("/api/vehicles/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      
      const validation = insertVehicleSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid vehicle data", 
          errors: fromZodError(validation.error).toString() 
        });
      }

      const vehicle = await storage.updateVehicle(id, validation.data, userId);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      
      const success = await storage.deleteVehicle(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Vehicle expense routes
  app.get("/api/vehicles/:id/expenses", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const vehicleId = parseInt(req.params.id);
      
      const expenses = await storage.getVehicleExpenses(vehicleId, userId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching vehicle expenses:", error);
      res.status(500).json({ message: "Failed to fetch vehicle expenses" });
    }
  });

  app.post("/api/vehicles/:id/expenses", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const vehicleId = parseInt(req.params.id);
      
      const validation = insertVehicleExpenseSchema.safeParse({
        ...req.body,
        vehicleId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid expense data", 
          errors: fromZodError(validation.error).toString() 
        });
      }

      const expense = await storage.addVehicleExpense(validation.data, userId);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Error creating vehicle expense:", error);
      res.status(500).json({ message: "Failed to create vehicle expense" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getVehicleStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
