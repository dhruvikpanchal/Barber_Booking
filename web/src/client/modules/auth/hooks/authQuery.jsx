import { createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { authServices } from "@/client/modules/auth/services/authServices.jsx";
import { signIn } from "next-auth/react";

export const authHook = {
  Register: {
    useRegister: () => createMutation("register", authServices.register),
  },

  BarberRegister: {
    useBarberRegister: () => createMutation("barberRegister", authServices.barberRegister),
  },

  Login: {
    useLogin: () => createMutation("login", authServices.login),
  },

  GoogleLogin: {
    useGoogleLogin: () =>
      createMutation("googleLogin", async () =>
        signIn("google", {
          redirect: false,
        }),
      ),
  },

  Refresh: {
    useRefresh: () => createMutation("refresh", authServices.refresh),
  },

  ForgotPassword: {
    useForgotPassword: () => createMutation("forgotPassword", authServices.forgotPassword),
  },

  VerifyResetToken: {
    useVerifyResetToken: () => createMutation("verifyResetToken", authServices.verifyResetToken),
  },

  ResetPassword: {
    useResetPassword: () => createMutation("resetPassword", authServices.resetPassword),
  },

  Logout: {
    useLogout: () => createMutation("logout", authServices.logout),
  },
};
