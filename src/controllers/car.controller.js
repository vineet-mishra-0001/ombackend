import carModel from '../models/car.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllCars = async (req, res) => {
  try {
    const cars = await carModel.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const createCar = async (req, res) => {
//   try {
//     const mainImageFile = req.files?.image?.[0];
//     const galleryImages = req.files?.images || [];

//     // Use __dirname to resolve absolute path from the controller file
//     const uploadDir = path.resolve('uploads/cars');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     let mainImagePath;
//     if (mainImageFile) {
//       const filename = `${Date.now()}-${mainImageFile.originalname}`;
//       const filepath = path.join(uploadDir, filename);
//       fs.writeFileSync(filepath, mainImageFile.buffer);
//       mainImagePath = `/uploads/cars/${filename}`; // 👈 Serve this publicly
//     }

//     const galleryImagePaths = [];
//     for (const file of galleryImages) {
//       const filename = `${Date.now()}-${file.originalname}`;
//       const filepath = path.join(uploadDir, filename);
//       fs.writeFileSync(filepath, file.buffer);
//       galleryImagePaths.push(`/uploads/cars/${filename}`);
//     }

//     const { available, promoted, ...rest } = req.body;

//     const car = new carModel({
//       ...rest,
//       available: available === 'true' || available === true,
//       promoted: promoted === 'true' || promoted === true,

//       image: mainImagePath,
//       images: galleryImagePaths,
//     });

//     const savedCar = await car.save();
//     res.status(201).json(savedCar);
//   } catch (error) {
//     console.error('Car creation error:', error);
//     res
//       .status(500)
//       .json({ error: 'Failed to create car', details: error.message });
//   }
// };

export const createCar = async (req, res) => {
  try {
    const {
      available,
      promoted,
      image, // main image URL
      images = [], // array of gallery image URLs
      ...rest
    } = req.body;

    const car = new carModel({
      ...rest,
      available: available === 'true' || available === true,
      promoted: promoted === 'true' || promoted === true,
      image,
      images: Array.isArray(images) ? images : [images],
    });

    const savedCar = await car.save();

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: savedCar,
    });
  } catch (error) {
    console.error('Car creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create car',
      details: error.message,
    });
  }
};

// Update a car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCar = await carModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: updatedCar });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await carModel.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
