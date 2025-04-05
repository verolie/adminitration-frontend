"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import LogoImage from "/public/logo.png";
// import { createKey, encrypt } from '@/utils/encryption';

import { Box } from "@mui/material";

import styles from "./styles.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppContext } from "@/context/context";
import { AccountCircle } from "@mui/icons-material";
import { AlertBox } from "@/component/alertBox/alertBox";
import { User } from "@/utils/model/userModel";
import { loginProcess } from "./function/loginProcess";
// import { fetchUserRole } from "./login/functions/frontend/fetchUserRole";

function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({
    emailMessage: "",
    passwordMessage: "",
  });
  const [email, setEmail] = useState<string>();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      return;
    }
    try {
      const data: User = { email, password };
      const response = await loginProcess(data);
      console.log("Register Success:", response);

      setAlertMessage({
        message: "Login successful!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/choose-company");
      }, 2000); // Biar user bisa lihat alert sebelum diarahkan ke login
    } catch (error: any) {
      console.error("Register Error:", error.message);
      handleErrorbackend(error.message);
    }

    setIsLoading(false);
  };

  const validate = () => {
    setErrorMessage({
      emailMessage: "",
      passwordMessage: "",
    });

    if (!email || !password) {
      setErrorMessage({
        emailMessage: !email ? "Email is required" : "",
        passwordMessage: !password ? "Password is required" : "",
      });

      return false;
    }

    return true;
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorMessage({ emailMessage: "", passwordMessage: "" });
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorMessage({ emailMessage: "", passwordMessage: "" });
  };

  const handleErrorbackend = (message: string) => {
    console.log("Error dari backend:", message);
    setAlertMessage({ message, type: "error" });
  };

  return (
    <>
      <Box className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.card}>
            <Box className={styles.titleContainer}>
              {/* <Image alt="Logo" src={LogoImage} width={90} height={70} /> */}
              <AccountCircle style={{ fontSize: "60px" }} />
              <h1>Company Name</h1>
            </Box>
            <Box
              component="form"
              className={styles.inputContainer}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.fieldInput}>
                <label>Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={styles.inputField}
                  onChange={onChangeEmail}
                  value={email || ""}
                />

                {errorMessage.emailMessage && (
                  <span className={styles.errorMessageTextColor}>
                    {errorMessage.emailMessage}
                  </span>
                )}
              </div>
              <div className={styles.fieldInput}>
                <label>Password</label>
                <div className={styles.passField}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password || ""}
                    onChange={onChangePassword}
                  />
                  <svg onClick={handleClickShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </svg>
                </div>
                {errorMessage.passwordMessage && (
                  <span className={styles.errorMessageTextColor}>
                    {errorMessage.passwordMessage}
                  </span>
                )}
              </div>
              <Link href="#" className={styles.forgetPassword}>
                Forgot Password ?
              </Link>
              <div className={styles.buttonSubmit}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading" : "Login"}
                </button>
                <Link href="/register" className={styles.register}>
                  Don't have an account? <span>Sign Up</span>
                </Link>
              </div>
            </Box>
          </div>
        </div>
      </Box>

      {alertMessage && (
        <AlertBox
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}

export default Login;
