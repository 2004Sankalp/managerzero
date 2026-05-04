import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import { orchestrateStandup } from '../orchestrator/standupOrchestrator.js';

const router = express.Router();

router.post(
  '/summarize',
  [
    body('updates').isArray({ min: 1 }).withMessage('Updates must be a non-empty array'),
    body('updates.*.name').isString().notEmpty(),
    body('updates.*.yesterday').isString().notEmpty(),
    body('updates.*.today').isString().notEmpty(),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await orchestrateStandup(req.body.updates);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
