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
import { useAlert } from "@/context/AlertContext";
import { User } from "@/utils/model/userModel";
import { loginProcess } from "./function/loginProcess";
// import { fetchUserRole } from "./login/functions/frontend/fetchUserRole";

function Login() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({
    emailMessage: "",
    passwordMessage: "",
  });
  const [email, setEmail] = useState<string>();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRole = () => {
    setIsEmployee((prev) => !prev);
    // Clear form when switching roles
    setEmail("");
    setPassword("");
    setErrorMessage({
      emailMessage: "",
      passwordMessage: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData: User = { email, password, isEmployee };
      const response = await loginProcess(userData);
      showAlert("Login successful!", "success");
      if (!isEmployee) {
        router.push("/choose-company");
      } else {
        localStorage.setItem("companyID", response.data.company_id);
        router.push("/");
      }
    } catch (error: any) {
      showAlert(error.message || "An error occurred during login", "error");
    } finally {
      setIsLoading(false);
    }
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

    if (isEmployee && !email.includes('@')) {
      setErrorMessage({
        emailMessage: "Employee email must be in format username@company_unique_id",
        passwordMessage: "",
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

  return (
    <>
      <Box className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.card}>
            <Box className={styles.titleContainer}>
              <AccountCircle style={{ fontSize: "60px" }} />
              <div className={styles.titleContent}>
                <h1>Company Name</h1>
              </div>
            </Box>
            <Box
              component="form"
              className={styles.inputContainer}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.fieldInput}>
                <label>{isEmployee ? 'Username' : 'Email'}</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={styles.inputField}
                  onChange={onChangeEmail}
                  value={email || ""}
                  placeholder={isEmployee ? "username@company_unique_id" : "Enter your email"}
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
                    placeholder="Enter your password"
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
              <div className={styles.linkContainer}>
                <button 
                  type="button"
                  onClick={toggleRole}
                  className={styles.switchRoleLink}
                >
                  Switch to {isEmployee ? 'Owner' : 'Employee'}
                </button>
                <Link href="#" className={styles.forgetPassword}>
                  Forgot Password ?
                </Link>
              </div>
              <div className={styles.buttonSubmit}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading" : `Login as ${isEmployee ? 'Employee' : 'Owner'}`}
                </button>
                <Link href="/register" className={styles.register}>
                  Don't have an account? <span>Sign Up</span>
                </Link>
              </div>
            </Box>
          </div>
        </div>
      </Box>
    </>
  );
}

export default Login;
