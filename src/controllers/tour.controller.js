import Tour from '../models/tour.model.js';
import path from 'path';
import fs from 'fs';
import carModel from '../models/car.model.js';
// Get all tours
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToursAndCarsBySearch = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';

    const searchRegex = new RegExp(searchQuery, 'i'); // case-insensitive
    console.log('fefef');
    const [tours, cars] = await Promise.all([
      Tour.find({ title: { $regex: searchRegex } }),
      carModel.find({ name: { $regex: searchRegex } }),
    ]);

    res.status(200).json({
      message: 'Search results',
      searchQuery,
      tours,
      cars,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getToursWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = 10; // show 2 tours per request
    const skip = (page - 1) * limit;

    const total = await Tour.countDocuments();
    const tours = await Tour.find().skip(skip).limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTours: total,
      tours,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single tour
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new tour

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const createTour = async (req, res) => {
//     try {
//       const bannerImageFile = req.files?.bannerImage?.[0];
//       const galleryImages = req.files?.images || [];

//       const uploadDir = path.resolve('uploads/tours');
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       let bannerImagePath;
//       if (bannerImageFile) {
//         const filename = `${Date.now()}-${bannerImageFile.originalname}`;
//         const filepath = path.join(uploadDir, filename);
//         fs.writeFileSync(filepath, bannerImageFile.buffer);
//         bannerImagePath = `/uploads/tours/${filename}`;
//       }

//       const galleryImagePaths = [];
//       for (const file of galleryImages) {
//         const filename = `${Date.now()}-${file.originalname}`;
//         const filepath = path.join(uploadDir, filename);
//         fs.writeFileSync(filepath, file.buffer);
//         galleryImagePaths.push(`/uploads/tours/${filename}`);
//       }

//       const { available, promoted, ...rest } = req.body;

//       const tour = new Tour({
//         ...rest,
//         available: String(available).trim() === 'true',
//         promoted: String(promoted).trim() !== 'false',

//         bannerImage: bannerImagePath,
//         images: galleryImagePaths,
//         highlights: req.body.highlights || [],
//         itinerary: req.body.itinerary || [],
//         routePoints: req.body.routePoints || [],
//       });

//       const savedTour = await tour.save();
//       res.status(201).json(savedTour);
//     } catch (error) {
//       console.error('Tour creation error:', error);
//       res.status(500).json({ error: 'Failed to create tour', details: error.message });
//     }
//   };

// Update a tour
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTour)
      return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tour
export const deleteTour = async (req, res) => {
  try {
    const deleted = await Tour.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json({ message: 'Tour deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
