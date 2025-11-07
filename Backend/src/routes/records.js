import express from 'express';
const router = express.Router();
import upload from '../middleware/upload.js';

import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getStats
} from '../controllers/recordsController.js';

// Statistics route (must be before /:id route)
router.get('/stats', getStats);

// Main CRUD routes
router.post('/', upload.array('images', 10), createRecord);
router.get('/', getAllRecords);
router.get('/:id', getRecordById);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;