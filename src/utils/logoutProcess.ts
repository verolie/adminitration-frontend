import router from "next/router";
import Cookies from "js-cookie";

export const logoutProcess = () => {
    clearSession();
        router.push("/login");
}

const clearSession = () => {
      Cookies.remove("sessionId");
      localStorage.removeItem("token");
    };