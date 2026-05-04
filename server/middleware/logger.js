export const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};

export const logAgent = (agentName, duration, tokens) => {
  console.log(`[AGENT] ${agentName} completed in ${duration}ms (Tokens: ${tokens})`);
};
