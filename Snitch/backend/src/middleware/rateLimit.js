import rateLimit from 'express-rate-limit';

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export const generalLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

export const authLimiter = rateLimit({
  windowMs: ONE_HOUR,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

export const passwordResetLimiter = rateLimit({
  windowMs: ONE_HOUR,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password reset attempts, please try again later.' },
});

export const chatLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many chat messages, please slow down.' },
});

export const paymentLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many payment requests, please try again later.' },
});
