"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import styles from "./styles.module.css";
import SideBar from "./sideBar/sideBar";
import NavBar from "./navBar/navBar";
// import useTimeOutSession from '@/hooks/useTimeOutSession';
// import { logoutProcess } from '@/login/functions/frontend/logoutProcess';
// import { getUserName } from '../../utils/getLoggedInUserData';
// import { useContextUpdate } from '@/hooks/useContextUpdate';
// import { useRouter } from "next/navigation";

interface ResponsiveAppBarProps {
  isLogin?: boolean;
  // sessionId: string | null;
}

const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({
  isLogin = true,
  // sessionId,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  // const router = useRouter();

  // useTimeOutSession(isLogin, logoutProcess);
  // useContextUpdate(isLogin, sessionId);

  const fetchUsername = useCallback(async () => {
    if (typeof window !== "undefined") {
      const encryptedData = localStorage.getItem("token");
      // const fetchedUsername = await getUserName(
      //   isLogin,
      //   sessionId,
      //   encryptedData
      // );
      // setUsername(fetchedUsername);
      setUsername("test user");
    }
  }, [
    isLogin,
    // sessionId
  ]);

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
