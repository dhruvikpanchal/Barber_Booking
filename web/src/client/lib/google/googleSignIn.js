let googleScriptPromise = null;
let initializedClientId = null;
let credentialListener = null;
let googleUnavailableReason = "";

function getGoogleClientId() {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || "";
}

export function getGoogleUnavailableReason() {
  return googleUnavailableReason;
}

function shouldSkipGoogleOnThisOrigin() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") return false;
  if (process.env.NEXT_PUBLIC_GOOGLE_ALLOW_LOCALHOST === "true") return false;
  if (process.env.NODE_ENV === "development") return false;
  return true;
}

export function isGoogleSignInAvailable() {
  return Boolean(getGoogleClientId()) && !shouldSkipGoogleOnThisOrigin();
}

export function loadGoogleIdentityScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (shouldSkipGoogleOnThisOrigin()) {
    googleUnavailableReason =
      "Google sign-in is disabled on localhost. Set NEXT_PUBLIC_GOOGLE_ALLOW_LOCALHOST=true after whitelisting localhost in Google OAuth.";
    return Promise.reject(new Error(googleUnavailableReason));
  }
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google sign-in")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function requestGoogleIdToken() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("Google sign-in is not configured");
  }

  await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.top = "-9999px";
    host.style.left = "-9999px";
    document.body.appendChild(host);

    const timeout = setTimeout(() => {
      finish(reject, new Error("Google sign-in timed out. Please try again."));
    }, 120_000);

    function cleanup() {
      clearTimeout(timeout);
      if (host.parentNode) host.parentNode.removeChild(host);
    }

    function finish(fn, value) {
      if (settled) return;
      settled = true;
      cleanup();
      fn(value);
    }

    credentialListener = (response) => {
      if (response?.credential) {
        finish(resolve, response.credential);
      } else {
        finish(reject, new Error("Google sign-in was cancelled"));
      }
    };

    if (initializedClientId !== clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          credentialListener?.(response);
        },
        cancel_on_tap_outside: true,
      });
      initializedClientId = clientId;
    }

    window.google.accounts.id.renderButton(host, {
      theme: "outline",
      size: "large",
      type: "standard",
    });

    setTimeout(() => {
      const btn = host.querySelector('[role="button"], div[tabindex="0"]');
      if (btn) {
        btn.click();
      } else {
        finish(reject, new Error("Google sign-in is unavailable"));
      }
    }, 50);
  });
}

export async function ensureGoogleIdentityInitialized({ onCredential, onError }) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("Google sign-in is not configured");
  }
  await loadGoogleIdentityScript();

  credentialListener = async (response) => {
    if (!response?.credential) {
      onError?.(new Error("Google sign-in was cancelled"));
      return;
    }

    try {
      await onCredential(response.credential);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Google sign-in failed"));
    }
  };

  if (initializedClientId !== clientId) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        credentialListener?.(response);
      },
      cancel_on_tap_outside: true,
    });
    initializedClientId = clientId;
  }
}
