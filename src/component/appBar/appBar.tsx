"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import styles from "./styles.module.css";
import SideBar from "./sideBar/sideBar";
import NavBar from "./navBar/navBar";
import { decryptData } from "@/utils/encryption";
import Cookies from "js-cookie";
import { SessionData } from "@/utils/model/sessionData";

interface ResponsiveAppBarProps {
  isLogin?: boolean;
}

const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({
  isLogin = true,
}) => {
  const [username, setUsername] = useState<string | null>(null);

  const fetchUsername = useCallback(async () => {
    if (typeof window !== "undefined") {
      const encryptedSession = Cookies.get("sessionId");

      if (!encryptedSession) {
        setUsername(null);
        return;
      }

      try {
        const sessionData: SessionData = decryptData(
          encryptedSession
        ) as SessionData;
        console.log("user detail ", sessionData);
        setUsername(sessionData.username || "Unknown User");
      } catch (error) {
        console.error("Failed to decrypt session:", error);
        setUsername("Unknown User");
      }
    }
  }, [isLogin]);

  useEffect(() => {
    fetchUsername();
  }, [fetchUsername, isLogin]);

  const directToChangePass = () => {
    // return router.push("/reset-password");
  };

  return (
    // isLogin && (
    <>
      <AppBar className={styles.appBarZIndex} elevation={0}>
        <div className={styles.container}>
          <div className={styles.sideBar}>
            <SideBar />
          </div>
          <Toolbar className={styles.toolbar}>
            <NavBar
              username={username}
              onClickChangePass={directToChangePass}
            />
          </Toolbar>
        </div>
      </AppBar>
    </>
  );
  // );
};

export default ResponsiveAppBar;
