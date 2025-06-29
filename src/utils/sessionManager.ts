import { connectDB } from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

interface SessionInfo {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  lastActivity: Date;
}

interface JWTDecodedToken {
  userId: string;
  role: string;
  email: string;
  isAdmin: boolean;
  sessionId: string;
}

interface SessionUser {
  id: string;
  email: string;
  role: string;
  isAdmin: boolean;
  sessionId: string;
}

export class SessionManager {
  private static sessions: Map<string, SessionInfo> = new Map();
  private static readonly SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  /**
   * Create a new session
   */
  static async createSession(userId: string, email: string, role: string): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}`;
    const sessionInfo: SessionInfo = {
      userId,
      email,
      role,
      sessionId,
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, sessionInfo);
    
    // Update user's active session in database
    await connectDB();
    await User.findByIdAndUpdate(userId, { sessionId });

    return sessionId;
  }

  /**
   * Validate and refresh session
   */
  static validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const now = Date.now();
    const lastActivity = session.lastActivity.getTime();

    // Check if session has expired
    if (now - lastActivity > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return false;
    }

    // Update last activity
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);

    return true;
  }

  /**
   * Invalidate a session
   */
  static async invalidateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Remove from memory
      this.sessions.delete(sessionId);
      
      // Clear from database
      await connectDB();
      await User.findByIdAndUpdate(session.userId, { sessionId: null });
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  static async invalidateUserSessions(userId: string): Promise<void> {
    // Remove all sessions for this user from memory
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
      }
    }

    // Clear from database
    await connectDB();
    await User.findByIdAndUpdate(userId, { sessionId: null });
  }

  /**
   * Get active session info
   */
  static getSession(sessionId: string): SessionInfo | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Get all active sessions for a user
   */
  static getUserSessions(userId: string): SessionInfo[] {
    const userSessions: SessionInfo[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        userSessions.push(session);
      }
    }
    return userSessions;
  }

  /**
   * Verify JWT token and session
   */
  static async verifyTokenWithSession(token: string): Promise<{
    valid: boolean;
    user?: SessionUser;
    error?: string;
  }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTDecodedToken;
      
      // Check if session is still valid
      if (!this.validateSession(decoded.sessionId)) {
        return {
          valid: false,
          error: 'Session expired or invalid'
        };
      }

      // Verify user still exists and is active
      await connectDB();
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return {
          valid: false,
          error: 'User not found or inactive'
        };
      }

      return {
        valid: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          isAdmin: decoded.isAdmin,
          sessionId: decoded.sessionId
        }
      };

    } catch {
      return {
        valid: false,
        error: 'Invalid token'
      };
    }
  }
}

// Set up periodic cleanup of expired sessions
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    SessionManager.cleanupExpiredSessions();
  }, 15 * 60 * 1000); // Clean up every 15 minutes
}

export default SessionManager;
