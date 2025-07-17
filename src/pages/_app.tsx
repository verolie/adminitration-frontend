// pages/_app.tsx
import * as React from "react";
import "../styles/globals.css";
import { AppContextProvider } from "@/context/context";
import { AlertProvider } from "@/context/AlertContext";
import type { AppProps } from "next/app";
import createEmotionCache from "../createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

// Create client-side Emotion cache
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <AppContextProvider>
        <AlertProvider>
          <Component {...pageProps} />
        </AlertProvider>
      </AppContextProvider>
    </CacheProvider>
  );
}
