// const WorkRecord = require('../models/WorkRecord');
// const cloudinary = require('../config/cloudinary');

import { WorkRecord } from '../models/WorkRecord.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new work record
// @route   POST /api/records
// @access  Public
export const createRecord = async (req, res, next) => {
  try {
    const { title, description, billAmount } = req.body;

    // Validate required fields
    if (!description || !billAmount) {
      return res.status(400).json({
        success: false,
        error: 'Description and bill amount are required'
      });
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required'
      });
    }

    // Extract image URLs and public IDs from uploaded files
    const imageUrls = req.files.map(file => file.path);
    const cloudinaryPublicIds = req.files.map(file => file.filename);

    // Create work record
    const workRecord = await WorkRecord.create({
      title,
      description,
      billAmount: parseFloat(billAmount),
      imageUrls,
      cloudinaryPublicIds
    });

    res.status(201).json({
      success: true,
      data: workRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all work records
// @route   GET /api/records
// @access  Public
export const getAllRecords = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, sort = '-createdAt' } = req.query;

    const workRecords = await WorkRecord.find()
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await WorkRecord.countDocuments();

    res.status(200).json({
      success: true,
      count: workRecords.length,
      total,
      data: workRecords
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single work record by ID
// @route   GET /api/records/:id
// @access  Public
export const getRecordById = async (req, res, next) => {
  try {
    const workRecord = await WorkRecord.findById(req.params.id);

    if (!workRecord) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update work record
// @route   PUT /api/records/:id
// @access  Public
export const updateRecord = async (req, res, next) => {
  try {
    const { title, description, billAmount } = req.body;

    const workRecord = await WorkRecord.findById(req.params.id);

    if (!workRecord) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    // Update fields
    if (title !== undefined) workRecord.title = title;
    if (description !== undefined) workRecord.description = description;
    if (billAmount !== undefined) workRecord.billAmount = parseFloat(billAmount);

    await workRecord.save();

    res.status(200).json({
      success: true,
      data: workRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete work record
// @route   DELETE /api/records/:id
// @access  Public
export const deleteRecord = async (req, res, next) => {
  try {
    const workRecord = await WorkRecord.findById(req.params.id);

    if (!workRecord) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    // Delete images from Cloudinary
    if (workRecord.cloudinaryPublicIds && workRecord.cloudinaryPublicIds.length > 0) {
      try {
        await Promise.all(
          workRecord.cloudinaryPublicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId)
          )
        );
        console.log('✅ Images deleted from Cloudinary');
      } catch (error) {
        console.error('⚠️  Error deleting images from Cloudinary:', error.message);
        // Continue with record deletion even if image deletion fails
      }
    }

    // Delete record from database
    await workRecord.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics (total records, total bill amount)
// @route   GET /api/records/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    const totalRecords = await WorkRecord.countDocuments();
    
    const billStats = await WorkRecord.aggregate([
      {
        $group: {
          _id: null,
          totalBillAmount: { $sum: '$billAmount' },
          averageBillAmount: { $avg: '$billAmount' },
          maxBillAmount: { $max: '$billAmount' },
          minBillAmount: { $min: '$billAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        billStats: billStats[0] || {
          totalBillAmount: 0,
          averageBillAmount: 0,
          maxBillAmount: 0,
          minBillAmount: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
