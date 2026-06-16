const STORAGE_KEY = "io.auth.passwordReset";

const VERIFY_TTL_MS = 30 * 60 * 1000;
const RESET_TTL_MS = 15 * 60 * 1000;

function readFlow() {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeFlow(flow) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
}

export function clearPasswordResetFlow() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function startPasswordReset(email, resetFlowToken) {
  writeFlow({
    step: "verify",
    email: email.trim().toLowerCase(),
    resetFlowToken,
    startedAt: Date.now(),
  });
}

export function canAccessVerifyStep() {
  const flow = readFlow();
  if (!flow || flow.step !== "verify") return false;
  if (!flow.resetFlowToken || !flow.email) return false;
  if (Date.now() - flow.startedAt > VERIFY_TTL_MS) {
    clearPasswordResetFlow();
    return false;
  }
  return true;
}

export function getVerifyStepEmail() {
  const flow = readFlow();
  return flow?.email ?? "";
}

export function markTokenVerified(token) {
  const flow = readFlow();
  if (!flow) return;

  writeFlow({
    ...flow,
    step: "reset",
    verifiedToken: token,
    verifiedAt: Date.now(),
  });
}

export function canAccessResetStep() {
  const flow = readFlow();
  if (!flow || flow.step !== "reset") return false;
  if (!flow.verifiedToken) return false;
  if (Date.now() - flow.verifiedAt > RESET_TTL_MS) {
    clearPasswordResetFlow();
    return false;
  }
  return true;
}

export function getVerifiedResetToken() {
  const flow = readFlow();
  return flow?.verifiedToken ?? "";
}
