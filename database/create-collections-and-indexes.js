
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("../backend/.env", import.meta.url))
});

const collections = {
  users: {
    bsonType: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { bsonType: "string" },
      email: { bsonType: "string" },
      password: { bsonType: "string" },
      image: { bsonType: "string" },
      address: { bsonType: "object" },
      gender: { bsonType: "string" },
      dob: { bsonType: "string" },
      phone: { bsonType: "string" }
    }
  },

  doctors: {
    bsonType: "object",
    required: [
      "name", "email", "password", "image",
      "speciality", "degree", "experience",
      "about", "fees", "address", "date"
    ],
    properties: {
      name: { bsonType: "string" },
      email: { bsonType: "string" },
      password: { bsonType: "string" },
      image: { bsonType: "string" },
      speciality: { bsonType: "string" },
      degree: { bsonType: "string" },
      experience: { bsonType: "string" },
      about: { bsonType: "string" },
      available: { bsonType: "bool" },
      fees: { bsonType: "number" },
      address: { bsonType: "object" },
      date: { bsonType: "number" },
      slots_booked: { bsonType: "object" }
    }
  },

  appointments: {
    bsonType: "object",
    required: [
      "userId", "docId", "slotDate", "slotTime",
      "userData", "docData", "amount", "date"
    ],
    properties: {
      userId: { bsonType: "string" },
      docId: { bsonType: "string" },
      slotDate: { bsonType: "string" },
      slotTime: { bsonType: "string" },
      userData: { bsonType: "object" },
      docData: { bsonType: "object" },
      amount: { bsonType: "number" },
      date: { bsonType: "number" },
      cancelled: { bsonType: "bool" },
      payment: { bsonType: "bool" },
      isCompleted: { bsonType: "bool" }
    }
  }
};

const createDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const db = mongoose.connection.db;

    for (const [name, schema] of Object.entries(collections)) {
      const exists = await db
        .listCollections({ name })
        .hasNext();

      if (!exists) {
        await db.createCollection(name, {
          validator: { $jsonSchema: schema },
          validationLevel: "strict"
        });
        console.log(`Created collection: ${name}`);
      } else {
        await db.command({
          collMod: name,
          validator: { $jsonSchema: schema },
          validationLevel: "strict"
        });
        console.log(`Updated validator: ${name}`);
      }
    }

    // User indexes
    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true }
    );

    // Doctor indexes
    await db.collection("doctors").createIndex(
      { email: 1 },
      { unique: true }
    );

    await db.collection("doctors").createIndex(
      { speciality: 1, available: 1 }
    );

    // Appointment indexes
    await db.collection("appointments").createIndex(
      { userId: 1, date: -1 }
    );

    await db.collection("appointments").createIndex(
      { docId: 1, slotDate: 1, slotTime: 1 }
    );

    console.log("Collections, validators and indexes created successfully!");

  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createDatabase();
