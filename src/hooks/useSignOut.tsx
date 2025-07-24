import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../contexts/authContext";

export function useSignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [navigate]);

  return handleSignOut;
}
