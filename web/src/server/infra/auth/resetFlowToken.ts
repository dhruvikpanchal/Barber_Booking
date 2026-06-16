import jwt from "jsonwebtoken";
import { appConfig, env } from "@/server/config";
import { BadRequestError } from "@/server/modules/shared/helpers/AppError";

const RESET_FLOW_PURPOSE = "password-reset-flow";

type ResetFlowPayload = {
  purpose: typeof RESET_FLOW_PURPOSE;
  email: string;
};

export function signResetFlowToken(email: string): string {
  return jwt.sign(
    { purpose: RESET_FLOW_PURPOSE, email: email.toLowerCase() },
    env.JWT_ACCESS_SECRET,
    { expiresIn: `${appConfig.mail.passwordResetExpiresMinutes}m` },
  );
}

export function verifyResetFlowToken(token: string): { email: string } {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as ResetFlowPayload;
    if (payload.purpose !== RESET_FLOW_PURPOSE || !payload.email) {
      throw new BadRequestError("Invalid reset flow token");
    }
    return { email: payload.email };
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new BadRequestError("Invalid or expired reset flow token");
  }
}
