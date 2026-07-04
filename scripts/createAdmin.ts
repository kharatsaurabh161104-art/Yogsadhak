import bcrypt from "bcryptjs";
import mongoose from "mongoose";

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required");
    process.exit(1);
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);

    const Admin = mongoose.model(
      "Admin",
      new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      })
    );

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists with email:", ADMIN_EMAIL);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await Admin.create({
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Yogsadhak Admin",
    });

    console.log("Admin created successfully:", ADMIN_EMAIL);
    console.log("Password hash:", passwordHash);
    console.log("Add this hash to your .env.local as ADMIN_PASSWORD_HASH");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();
