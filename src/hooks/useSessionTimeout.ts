import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { logoutProcess } from "@/utils/logoutProcess";

const SESSION_TIMEOUT = 15 * 60 * 1000;
const CHECK_INTERVAL = 10 * 1000;

export const useSessionTimeout = () => {
  const router = useRouter();

  useEffect(() => {
    checkSession();
    resetSessionTimer();

    const interval = setInterval(checkSession, CHECK_INTERVAL);

    window.addEventListener("mousemove", resetSessionTimer);
    window.addEventListener("click", resetSessionTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetSessionTimer);
      window.removeEventListener("click", resetSessionTimer);
      clearTimeout((window as any).sessionTimer);
    };
  }, [router]);

  const checkSession = () => {
      const sessionId = Cookies.get("sessionId");
      const token = localStorage.getItem("token");

      if (!sessionId || !token) {
        logoutProcess();
      }
    };

    const resetSessionTimer = () => {
      clearTimeout((window as any).sessionTimer);
      (window as any).sessionTimer = setTimeout(() => {
        logoutProcess();
      }, SESSION_TIMEOUT);
    };
};
