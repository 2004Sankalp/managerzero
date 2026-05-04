import express from 'express';
import { body, param } from 'express-validator';
import crypto from 'crypto';
import { validateRequest } from '../middleware/validate.js';
import { orchestrateFeedback } from '../orchestrator/feedbackOrchestrator.js';
import { sendFeedbackRequest } from '../services/emailService.js';

const router = express.Router();

// In-memory store: token → { meta, responses[] }
// In production this would be a DB table
const surveyStore = new Map();

// ── POST /api/feedback/send-request ─────────────────────────────────────────
// Manager sends a survey email to a client. Returns a token to poll responses.
router.post(
  '/send-request',
  [
    body('clientEmail').isEmail().withMessage('Valid client email is required'),
    body('clientName').isString().notEmpty(),
    body('projectName').isString().notEmpty(),
    body('sprintNumber').isString().notEmpty(),
    body('customMessage').isString().notEmpty(),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      const { clientEmail, clientName, projectName, sprintNumber, customMessage } = req.body;

      // Store survey metadata
      surveyStore.set(token, {
        meta: { clientEmail, clientName, projectName, sprintNumber, customMessage, sentAt: new Date().toISOString() },
        responses: [],
      });

      // Build a public feedback form URL (served by the React app)
      const feedbackUrl = `http://localhost:5173/feedback/${token}`;

      // Try to send the real email — non-fatal if Resend fails (e.g. domain not verified)
      let emailWarning = null;
      try {
        await sendFeedbackRequest({ clientEmail, clientName, projectName, sprintNumber, customMessage, feedbackUrl });
      } catch (emailErr) {
        console.warn('[EMAIL] Resend failed:', emailErr.message);
        emailWarning = emailErr.message;
      }

      res.json({ success: true, token, feedbackUrl, emailWarning });
    } catch (error) {
      next(error);
    }
  }
);

// ── GET /api/feedback/responses/:token ──────────────────────────────────────
// Manager polls this to get all client responses for a survey token.
router.get('/responses/:token', (req, res) => {
  const survey = surveyStore.get(req.params.token);
  if (!survey) return res.status(404).json({ error: 'Survey not found' });
  res.json({ meta: survey.meta, responses: survey.responses });
});

// ── GET /api/feedback/form/:token ────────────────────────────────────────────
// Client-facing: get survey metadata to populate the public form.
router.get('/form/:token', (req, res) => {
  const survey = surveyStore.get(req.params.token);
  if (!survey) return res.status(404).json({ error: 'This feedback link is invalid or expired.' });
  // Only return non-sensitive meta
  const { clientName, projectName, sprintNumber } = survey.meta;
  res.json({ clientName, projectName, sprintNumber });
});

// ── POST /api/feedback/submit/:token ─────────────────────────────────────────
// Client submits feedback via the public form page.
router.post(
  '/submit/:token',
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('text').isString().isLength({ min: 5, max: 2000 }),
  ],
  validateRequest,
  (req, res) => {
    const survey = surveyStore.get(req.params.token);
    if (!survey) return res.status(404).json({ error: 'Survey not found or already closed.' });

    const { rating, text } = req.body;
    const entry = {
      id: Date.now(),
      client: survey.meta.clientName,
      project: survey.meta.projectName,
      sprint: survey.meta.sprintNumber,
      rating: parseInt(rating),
      text,
      receivedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      submittedAt: new Date().toISOString(),
    };
    survey.responses.unshift(entry);

    res.json({ success: true, message: 'Thank you for your feedback!' });
  }
);

// ── POST /api/feedback/analyze ───────────────────────────────────────────────
// Manager triggers AI sentiment analysis on collected responses.
router.post(
  '/analyze',
  [
    body('feedbacks').isArray({ min: 1 }),
    body('feedbacks.*.client').isString().notEmpty(),
    body('feedbacks.*.rating').isNumeric().isInt({ min: 1, max: 5 }),
    body('feedbacks.*.text').isString().notEmpty(),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await orchestrateFeedback(req.body.feedbacks);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
