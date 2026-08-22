const rateLimitStore = new Map();

function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests" } = {}) {
  return (req, res, next) => {
    // Skip rate limiting in development for easier testing
    if (process.env.NODE_ENV !== "production") return next();

    const key = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }

    const timestamps = rateLimitStore.get(key).filter((t) => t > windowStart);
    rateLimitStore.set(key, timestamps);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    timestamps.push(now);
    next();
  };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}, 5 * 60 * 1000);

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many authentication attempts. Please try again later.",
});

export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many messages. Please slow down.",
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests. Please try again later.",
});
