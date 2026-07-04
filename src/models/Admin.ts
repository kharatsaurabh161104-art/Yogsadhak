import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
