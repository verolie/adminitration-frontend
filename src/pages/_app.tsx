import "../styles/globals.css"; // Pastikan path benar
import { AppContextProvider } from "@/context/context";
import { AlertProvider } from "@/context/AlertContext";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </AppContextProvider>
  );
}

export default MyApp;
