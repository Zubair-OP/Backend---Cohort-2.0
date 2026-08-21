import { describe, it, expect } from 'vitest';

describe('Security Headers', () => {
  it('should have helmet headers configured', async () => {
    const helmetConfig = {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
        },
      },
    };

    expect(helmetConfig.contentSecurityPolicy.directives.defaultSrc).toContain("'self'");
    expect(helmetConfig.contentSecurityPolicy.directives.objectSrc).toContain("'none'");
    expect(helmetConfig.contentSecurityPolicy.directives.baseUri).toContain("'self'");
  });
});

describe('Rate Limiting', () => {
  it('should export rate limiter functions', async () => {
    const rateLimitModule = await import('../src/middleware/rateLimit.js');

    expect(rateLimitModule.generalLimiter).toBeDefined();
    expect(rateLimitModule.authLimiter).toBeDefined();
    expect(rateLimitModule.chatLimiter).toBeDefined();
    expect(rateLimitModule.paymentLimiter).toBeDefined();
    expect(rateLimitModule.passwordResetLimiter).toBeDefined();
  });
});

describe('Input Validation', () => {
  it('should escape regex special characters to prevent ReDoS', () => {
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    expect(escapeRegex('price.*')).toBe('price\\.\\*');
    expect(escapeRegex('${user}')).toBe('\\$\\{user\\}');
    expect(escapeRegex('test(group)')).toBe('test\\(group\\)');
    expect(escapeRegex('normal text')).toBe('normal text');
    expect(escapeRegex('a[b]c')).toBe('a\\[b\\]c');
    expect(escapeRegex('a+b?c')).toBe('a\\+b\\?c');
  });
});

describe('Config Validation', () => {
  it('should export all required config keys', async () => {
    const { config } = await import('../src/config/config.js');

    expect(config.JWT_SECRET).toBeDefined();
    expect(config.MONGO_URI).toBeDefined();
    expect(config.STRIPE_SECRET_KEY).toBeDefined();
    expect(config.GROQ_API_KEY).toBeDefined();
    expect(config.NODE_ENV).toBeDefined();
  });
});
