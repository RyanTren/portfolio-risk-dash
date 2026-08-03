import { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  text?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = "Google",
}: GoogleSignInProps) {
  const { loginWithGoogle } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch client ID from backend on mount
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await API.get("/api/auth/google-client-id");
        const id = response.data.clientId;
        if (id && id.length > 0) {
          setClientId(id);
        }
      } catch {
        // Silently fail - Google button will show "not configured" state
      }
    };
    fetchClientId();
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (clientId && !isLoaded) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    }
  }, [clientId, isLoaded]);

  // Initialize Google when script is loaded and clientId is available
  const initializeGoogle = useCallback(() => {
    if (!window.google || !clientId || isInitialized) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          await loginWithGoogle(response.credential);
          onSuccess?.();
          // Navigate after successful login
          window.location.href = "/portfolios";
        } catch {
          onError?.("Google sign-in failed. Please try again.");
        }
      },
    });

    setIsInitialized(true);
  }, [clientId, isInitialized, loginWithGoogle, onSuccess, onError]);

  useEffect(() => {
    if (isLoaded && clientId) {
      initializeGoogle();
    }
  }, [isLoaded, clientId, initializeGoogle]);

  const handleClick = () => {
    if (!clientId) {
      onError?.("Google sign-in is not configured.");
      return;
    }

    if (!window.google) {
      onError?.("Google sign-in is loading, please try again.");
      return;
    }

    // Re-initialize if needed and show the prompt
    if (!isInitialized) {
      initializeGoogle();
    }

    window.google.accounts.id.prompt();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!clientId}
      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={!clientId ? "Google sign-in not configured" : ""}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {text}
    </button>
  );
}
