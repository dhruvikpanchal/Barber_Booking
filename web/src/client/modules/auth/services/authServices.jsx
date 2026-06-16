import api, { getRefreshToken, setAuthTokens } from "@/lib/axios";
import { clearAuthSession } from "@/client/lib/auth/session.js";

/**
 * Generic POST helper
 */
async function post(path, data) {
  const response = await api.post(path, data);
  return response.data;
}

/**
 * Auth POST helper
 * Automatically stores tokens when returned by API
 */
async function authPost(path, data) {
  const result = await post(path, data);

  if (result?.tokens) {
    setAuthTokens(result.tokens);
  }

  return result;
}

export const authServices = {
  // Customer Registration
  register: (data) => authPost("/auth/register", data),

  // Barber Application
  barberRegister: (data) => post("/auth/barber-register", data),

  // Email & Password Login
  login: (data) => authPost("/auth/login", data),

  // Google Login
  googleLogin: (data) => authPost("/auth/google", data),

  // Refresh Access Token
  refresh: async (data) => {
    const payload = data ?? {
      refreshToken: getRefreshToken(),
    };

    const result = await post("/auth/refresh", payload);

    if (result?.tokens) {
      setAuthTokens(result.tokens);
    }

    return result;
  },

  // Forgot Password
  forgotPassword: (data) => post("/auth/forgot-password", data),

  // Verify reset token (OTP step)
  verifyResetToken: (data) => post("/auth/verify-reset-token", data),

  // Validate password-reset flow token (guards verify step)
  validateResetFlow: (data) => post("/auth/validate-reset-flow", data),

  // Reset Password
  resetPassword: (data) => post("/auth/reset-password", data),

  // Logout
  logout: async () => {
    try {
      await post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthSession();
    }
  },
};

export default authServices;
