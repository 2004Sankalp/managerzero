import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import { orchestrateMeeting } from '../orchestrator/meetingOrchestrator.js';

const router = express.Router();

router.post(
  '/analyze',
  [
    body('transcript')
      .isString()
      .isLength({ min: 50, max: 15000 })
      .withMessage('Transcript must be a string between 50 and 15000 characters'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await orchestrateMeeting(req.body.transcript);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
