import { sanitizeInput, secureStorage } from '../utils/security';
import { loginSchema, signupSchema } from '../utils/validation';

const SESSION_KEY = 'luxor_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const API_BASE_URL =
    import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

class AuthService {
    async register(userData) {
        try {
            const validation = signupSchema.safeParse(userData);
            if (!validation.success) {
                return {
                    success: false,
                    error: validation.error.errors[0].message,
                };
            }

            const sanitizedCommon = {
                firstName: sanitizeInput(userData.firstName),
                lastName: sanitizeInput(userData.lastName),
                email: sanitizeInput(userData.email),
                phone: sanitizeInput(userData.phone),
                password: userData.password,
            };

            const fullName = `${sanitizedCommon.firstName} ${sanitizedCommon.lastName}`.trim();
            const isTourist = userData.role === 'Tourist';

            const endpoint = isTourist
                ? '/auth/signup/tourist'
                : '/auth/signup/owner';

            const payload = isTourist
                ? {
                    name: fullName,
                    email: sanitizedCommon.email,
                    phone: sanitizedCommon.phone,
                    password: sanitizedCommon.password,
                }
                : {
                    name: fullName,
                    email: sanitizedCommon.email,
                    phone: sanitizedCommon.phone,
                    password: sanitizedCommon.password,
                    companyName: sanitizeInput(userData.companyName),
                    licenseNumber: sanitizeInput(userData.licenseNumber),
                };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data?.message || 'Registration failed',
                };
            }

            const apiUser = data.user || {};
            const [apiFirstName, ...apiLastParts] = (apiUser.name || '').split(' ');
            const apiLastName = apiLastParts.join(' ');

            const newUser = {
                id: apiUser.id,
                firstName: sanitizedCommon.firstName || apiFirstName,
                lastName: sanitizedCommon.lastName || apiLastName,
                email: apiUser.email || sanitizedCommon.email,
                phone: sanitizedCommon.phone,
                role: apiUser.role || userData.role || 'Tourist',
                companyName: apiUser.companyName || userData.companyName || null,
                licenseNumber: userData.licenseNumber || null,
                businessDescription: userData.businessDescription || null,
                createdAt: new Date().toISOString(),
            };

            this.createSession(newUser);

            return {
                success: true,
                user: newUser,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Registration failed. Please try again.',
            };
        }
    }

    async login(email, password) {
        try {
            const validation = loginSchema.safeParse({ email, password });
            if (!validation.success) {
                return {
                    success: false,
                    error: validation.error.errors[0].message,
                };
            }

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: sanitizeInput(email),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data?.message || 'Invalid email or password',
                };
            }

            const apiUser = data.user || {};
            const [firstName, ...lastParts] = (apiUser.name || '').split(' ');
            const lastName = lastParts.join(' ');

            const user = {
                id: apiUser.id,
                firstName: firstName || '',
                lastName: lastName || '',
                email: apiUser.email || email,
                phone: apiUser.phone || '',
                role: apiUser.role,
                companyName: apiUser.companyName || null,
                createdAt: new Date().toISOString(),
            };

            this.createSession(user);

            return {
                success: true,
                user,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Login failed. Please try again.',
            };
        }
    }

    logout() {
        secureStorage.removeItem(SESSION_KEY);

        // Best-effort backend logout to clear cookie
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).catch(() => {});
    }

    createSession(user) {
        const session = {
            user,
            expiresAt: Date.now() + SESSION_DURATION,
        };
        secureStorage.setItem(SESSION_KEY, session);
    }

    getSession() {
        const session = secureStorage.getItem(SESSION_KEY);
        if (!session) return null;

        if (Date.now() > session.expiresAt) {
            this.logout();
            return null;
        }

        return session;
    }

    getCurrentUser() {
        const session = this.getSession();
        return session?.user || null;
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    async updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const updatedUser = {
            ...currentUser,
            firstName: sanitizeInput(updates.firstName ?? currentUser.firstName),
            lastName: sanitizeInput(updates.lastName ?? currentUser.lastName),
            phone: sanitizeInput(updates.phone ?? currentUser.phone),
        };

        this.createSession(updatedUser);
        return { success: true, user: updatedUser };
    }

    async changePassword() {
        return {
            success: false,
            error: 'Change password via backend endpoint (not yet wired).',
        };
    }
}

export default new AuthService();
