import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { logoutProcess } from "@/utils/logoutProcess";
import { useAlert } from "@/context/AlertContext";



const SESSION_TIMEOUT = 15 * 60 * 1000;
const CHECK_INTERVAL = 10 * 1000;

export const useSessionTimeout = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
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
        showAlert("Session expired", "error");
        logoutProcess();
      }

      const companyId = localStorage.getItem("companyID");
      if (!companyId) {
        showAlert("Please choose company", "error");
        router.push("/choose-company");
      }
    };

    const resetSessionTimer = () => {
      clearTimeout((window as any).sessionTimer);
      (window as any).sessionTimer = setTimeout(() => {
        logoutProcess();
      }, SESSION_TIMEOUT);
    };
};
