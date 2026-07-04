import mongoose, { Schema, Model, Document } from "mongoose";
import { addMonths } from "date-fns";

export interface IStudent extends Document {
  receiptNumber: string;

  fullName: string;

  dob: Date;

  age: number;

  gender: "Male" | "Female" | "Other";

  occupation?: string;

  weight?: number;

  address: string;

  mobileNumber: string;

  email?: string;

  isVrindavanResident: boolean;

  batch: {
    id: string;
    time: string;
    location: string;
    type: "morning" | "evening";
  };

  category: "adult" | "child";

  fees: number;

  sessionStartDate: Date;

  sessionEndDate: Date;

  paymentStatus: "pending" | "paid";

  registeredAt: Date;

  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    receiptNumber: {
      type: String,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    occupation: {
      type: String,
    },

    weight: {
      type: Number,
    },

    address: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
    },

    isVrindavanResident: {
      type: Boolean,
      default: false,
    },

    batch: {
      id: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: ["morning", "evening"],
        required: true,
      },
    },

    category: {
      type: String,
      enum: ["adult", "child"],
    },

    fees: {
      type: Number,
    },

    sessionStartDate: {
      type: Date,
      required: true,
    },

    sessionEndDate: {
      type: Date,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "registeredAt",
      updatedAt: "updatedAt",
    },
  }
);

async function getNextReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear().toString();

  const lastStudent = await mongoose
    .model<IStudent>("Student")
    .findOne({
      receiptNumber: new RegExp(`^YS-${year}-`),
    })
    .sort({
      receiptNumber: -1,
    })
    .select("receiptNumber")
    .lean();

  let counter = 1;

  if (lastStudent?.receiptNumber) {
    const parts = lastStudent.receiptNumber.split("-");

    counter = parseInt(parts[2], 10) + 1;
  }

  return `YS-${year}-${counter
    .toString()
    .padStart(5, "0")}`;
}

StudentSchema.pre<IStudent>("save", async function () {
  if (this.isNew) {
    this.receiptNumber = await getNextReceiptNumber();
  }

  if (this.isModified("sessionStartDate") || this.isNew) {
    this.sessionEndDate = addMonths(
      this.sessionStartDate,
      1
    );
  }

  if (this.isModified("age") || this.isNew) {
    this.category = this.age < 18 ? "child" : "adult";

    this.fees = this.age < 18 ? 599 : 699;
  }
});

const Student: Model<IStudent> =
  mongoose.models.Student ??
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;