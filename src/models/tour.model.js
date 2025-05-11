import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
    day: Number,
    title: String,
    description: String,
    image: String
});

const routePointSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number
});

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: String,
    difficulty: String,
    price: String,
    rating: Number,
    reviews: Number,
    bannerImage: String,
    images: [String], // <-- Add this
    description: String,
    highlights: [String],
    itinerary: [itinerarySchema],
    routePoints: [routePointSchema]
}, {
    timestamps: true
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
