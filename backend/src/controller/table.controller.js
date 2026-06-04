import { getAuth } from "@clerk/express";
import Table from "../modal/table.modal.js";
import User from "../modal/user.modal.js";

// Create a new table (admin only)
export const createTable = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { tableNumber, capacity, status } = req.body;

    if (!tableNumber || !capacity) {
      return res
        .status(400)
        .json({ message: "Table number and capacity are required" });
    }

    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res
        .status(409)
        .json({ message: `Table #${tableNumber} already exists` });
    }

    const table = new Table({
      userId: user._id,
      tableNumber,
      capacity,
      status: status || "available",
    });

    await table.save();
    return res
      .status(201)
      .json({ message: "Table created successfully", table });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create table", error: error.message });
  }
};

// Get all tables (with optional filters)
export const getTables = async (req, res) => {
  try {
    const { status, minCapacity } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (minCapacity) {
      query.capacity = { $gte: parseInt(minCapacity) };
    }

    const tables = await Table.find(query).sort({ tableNumber: 1 });

    return res.status(200).json({
      tables,
      totalTables: tables.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get tables", error: error.message });
  }
};

// Get a single table by ID
export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    return res.status(200).json({ table });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to find table", error: error.message });
  }
};

// Update a table (admin only)
export const updateTable = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id } = req.params;
    const { tableNumber, capacity, status } = req.body;

    // Check if trying to change table number to one that already exists
    if (tableNumber) {
      const existingTable = await Table.findOne({
        tableNumber,
        _id: { $ne: id },
      });
      if (existingTable) {
        return res
          .status(409)
          .json({ message: `Table #${tableNumber} already exists` });
      }
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      {
        ...(tableNumber && { tableNumber }),
        ...(capacity && { capacity }),
        ...(status && { status }),
      },
      { new: true },
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    return res
      .status(200)
      .json({ message: "Table updated successfully", table: updatedTable });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update table", error: error.message });
  }
};

// Update table status only (e.g. mark as occupied/available/cleaning)
export const updateTableStatus = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["available", "occupied", "cleaning"].includes(status)) {
      return res.status(400).json({
        message: "Valid status required (available, occupied, cleaning)",
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    return res
      .status(200)
      .json({ message: "Table status updated", table: updatedTable });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update table status", error: error.message });
  }
};

// Delete a table (admin only)
export const deleteTable = async (req, res) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id } = req.params;
    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    return res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete table", error: error.message });
  }
};
