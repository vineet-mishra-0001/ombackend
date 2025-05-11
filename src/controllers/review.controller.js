import carModel from '../models/car.model.js';
import reviewModel from '../models/review.model.js';

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel
            .find()
            .populate({
                path: "userId",
                select: "-password"
            });
        res.status(200).json({ message: 'All reviews', reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getReviewByCarId = async (req, res) => {
    try {
        const car = await carModel.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        const reviews = await reviewModel.find({ carId: req.params.id }).populate({
            path: "userId",
            select: "-password"
        });
        
        res.status(200).json({ message: 'Reviews for car', reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const createReview = async (req, res) => {
    try {
        const { userId, carId, ratingCount, comment } = req.body;
        const review = new reviewModel({
            userId,
            carId,
            ratingCount,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Review created', review });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


