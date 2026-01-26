import DOMPurify from 'dompurify';

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
};

// Secure storage wrapper (using base64 encoding for demo)
export const secureStorage = {
    setItem: (key, value) => {
        const encoded = btoa(JSON.stringify(value));
        localStorage.setItem(key, encoded);
    },
    getItem: (key) => {
        const encoded = localStorage.getItem(key);
        if (!encoded) return null;
        try {
            return JSON.parse(atob(encoded));
        } catch {
            return null;
        }
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    },
};

// Simple password hashing (SHA-256)
export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Generate CSRF token
export const generateCSRFToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts, windowMs) => {
    const attempts = new Map();

    return {
        check: (key) => {
            const now = Date.now();
            const userAttempts = attempts.get(key) || [];
            const recentAttempts = userAttempts.filter(time => now - time < windowMs);

            if (recentAttempts.length >= maxAttempts) {
                return false;
            }

            recentAttempts.push(now);
            attempts.set(key, recentAttempts);
            return true;
        },
        reset: (key) => {
            attempts.delete(key);
        },
    };
};

// Escape HTML
export const escapeHTML = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};
