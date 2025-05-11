import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },

    ratingCount: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;