// Security validation utilities
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = {
  // Email validation and sanitization
  email: (email: string): string | null => {
    if (!email || typeof email !== 'string') return null;
    const sanitized = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
  },

  // Text input sanitization
  text: (input: string, maxLength: number = 1000): string => {
    if (!input || typeof input !== 'string') return '';
    return input.trim().slice(0, maxLength);
  },

  // HTML content sanitization
  html: (html: string): string => {
    if (!html || typeof html !== 'string') return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });
  },

  // Phone number sanitization
  phone: (phone: string): string => {
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/[^\d+\-\s()]/g, '').trim();
  },

  // Numeric validation
  number: (value: string | number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number | null => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num < min || num > max) return null;
    return num;
  },

  // URL validation
  url: (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol) ? url : null;
    } catch {
      return null;
    }
  }
};

export const validateRequired = (fields: Record<string, any>): string[] => {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push(`${key.replace('_', ' ')} is required`);
    }
  }
  return errors;
};

export const rateLimitCheck = (() => {
  const attempts: Record<string, { count: number; lastAttempt: number }> = {};
  
  return (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now();
    const record = attempts[identifier];
    
    if (!record || now - record.lastAttempt > windowMs) {
      attempts[identifier] = { count: 1, lastAttempt: now };
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    record.lastAttempt = now;
    return true;
  };
})();