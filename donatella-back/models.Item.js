import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["chocolate", "powder", "others"],
      required: true,
    },
    image: {
      type: String, // data URL or external URL
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index on category for faster queries
itemSchema.index({ category: 1 });

// Ensure JSON outputs have `id` instead of `_id`
itemSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Item = mongoose.model("Item", itemSchema);

