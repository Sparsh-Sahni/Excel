import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const connectDB = async () => {
  try {
    console.log("mongo_uri: ", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // ===== PHONE FIELD CLEANUP (ONE-TIME MIGRATION) =====
    const collection = conn.connection.db.collection('users');
    
    // 1. Check if cleanup is still needed
    const phoneFieldExists = await collection.countDocuments({
      $or: [
        { phone: { $exists: true } },
        { phone: null }
      ]
    }) > 0;

    const hasPhoneIndex = (await collection.listIndexes().toArray())
      .some(index => index.key?.phone !== undefined);

    if (!phoneFieldExists && !hasPhoneIndex) {
      console.log("✅ Phone field cleanup already completed");
      return;
    }

    // 2. Remove indexes if they exist
    if (hasPhoneIndex) {
      await collection.dropIndex("phone_1");
      console.log("✅ Dropped phone_1 index");
    }

    // 3. Remove field from all documents
    const { modifiedCount } = await collection.updateMany(
      {},
      { $unset: { phone: "" } },
      { bypassDocumentValidation: true }
    );
    
    if (modifiedCount > 0) {
      console.log(`♻️ Removed phone field from ${modifiedCount} documents`);
    }

    // 4. Final verification
    const remaining = await collection.countDocuments({
      $or: [
        { phone: { $exists: true } },
        { phone: null }
      ]
    });
    
    if (remaining === 0) {
      console.log("✔️ Phone field cleanup completed successfully");
    } else {
      console.warn(`⚠️ ${remaining} documents still have phone field - retrying...`);
      await collection.updateMany(
        {},
        [{ $set: { phone: "$$REMOVE" } }],
        { bypassDocumentValidation: true }
      );
      console.log("✔️ Forced removal complete");
    }

  } catch (error) {
    console.error("❌ Connection error:", error.message);
    process.exit(1);
  }
};