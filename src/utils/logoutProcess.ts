import router from "next/router";
import Cookies from "js-cookie";

export const logoutProcess = () => {
    clearSession();
    router.push("/login");
}

const clearSession = () => {
    // Clear all cookies
    Cookies.remove("sessionId");
    
    // Clear all localStorage data
    localStorage.clear();
    
    // Clear sessionStorage if needed
    sessionStorage.clear();
};