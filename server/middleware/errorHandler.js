export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] `, err.message || err);

  const statusCode = err.status || 500;
  
  let errorMessage = err.message || 'Internal Server Error';
  
  if (errorMessage.includes('quota') || errorMessage.includes('429')) {
    errorMessage = 'AI Daily Limit Reached. Your Gemini API key has exceeded its free tier limits. Please use a different key or try again tomorrow.';
  } else if (errorMessage.startsWith('{')) {
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed.error?.message) errorMessage = parsed.error.message;
    } catch (e) {}
  }

  const errorResponse = {
    error: errorMessage,
    code: err.code || 'INTERNAL_ERROR'
  };

  if (err.agentFailed) {
    errorResponse.agentFailed = err.agentFailed;
  }

  // Never expose stack trace
  res.status(statusCode).json(errorResponse);
};
