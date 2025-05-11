// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  discount: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  available: { type: Boolean, default: true },
  promoted: { type: Boolean, default: false },
  features: {
    seats: Number,
    mileage: String,
    fuelType: String,
    year: Number,
    transmission: String
  },
  image: { type: String }, // Thumbnail or primary
  images: [{ type: String }], // Extra images
}, { timestamps: true });

// Add a pre-save middleware to update available status based on quantity
carSchema.pre('save', function(next) {
  this.available = this.quantity > 0;
  next();
});

// Method to temporarily reduce quantity (for booking)
carSchema.methods.reserveForBooking = async function() {
  if (this.quantity <= 0) {
    throw new Error('Car is not available for booking');
  }
  
  // Store original quantity if not already stored
  if (!this.originalQuantity) {
    this.originalQuantity = this.quantity;
  }
  
  this.quantity = 0;
  await this.save();
  return this;
};

// Method to restore quantity (if payment fails or booking cancelled)
carSchema.methods.restoreQuantity = async function() {
  if (this.originalQuantity !== undefined) {
    this.quantity = this.originalQuantity;
    this.originalQuantity = undefined;
    await this.save();
  }
  return this;
};

// Method to confirm booking (keep quantity at 0)
carSchema.methods.confirmBooking = async function() {
  this.originalQuantity = undefined; // Clear original quantity as booking is confirmed
  await this.save();
  return this;
};

export default mongoose.model("Car", carSchema);
