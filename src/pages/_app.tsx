import "../styles/globals.css"; // Pastikan path benar
import { AppContextProvider } from "@/context/context";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
