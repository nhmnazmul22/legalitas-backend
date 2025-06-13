import { RateLimiterMemory } from 'rate-limiter-flexible';

const maxWrongAttemptsByIPPerMinute = 5;

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'login_fail_ip',
  points: maxWrongAttemptsByIPPerMinute, // 5 attempts
  duration: 60, // per 60 seconds by IP
});

export default rateLimiter;
