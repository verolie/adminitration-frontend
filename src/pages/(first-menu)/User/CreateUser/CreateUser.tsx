import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { useAlert } from "@/context/AlertContext";
import { createUser } from "../function/createUser";
import { fetchOneCompany } from "../function/fetchOneCompany";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// const companyOptions = [
//   { value: "company1", label: "Company 1" },
//   { value: "company2", label: "Company 2" },
//   { value: "company3", label: "Company 3" },
// ];

export default function CreateUser() {
  const [usernameValue, setUsernameValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { showAlert } = useAlert();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = (status: "active" | "draft") => async () => {
    const token = localStorage.getItem("token");
    try {
      if (!usernameValue.trim()) {
        showAlert("Username cannot be empty", "error");
        return;
      }

      if (!emailValue.trim()) {
        showAlert("Email cannot be empty", "error");
        return;
      }

      if (!validateEmail(emailValue)) {
        showAlert("Please enter a valid email address", "error");
        return;
      }

      if (!passwordValue) {
        showAlert("Password cannot be empty", "error");
        return;
      }

      if (passwordValue !== confirmPasswordValue) {
        showAlert("Password and Confirm Password do not match", "error");
        return;
      }

      const payload = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        confirmPassword: confirmPasswordValue,
        status,
      };

      if (!token) {
        showAlert("Token not found", "error");
        return;
      }

      await createUser(payload, token);
      showAlert("User created successfully", "success");
      
      // Reset states to default values
      setUsernameValue("");
      setEmailValue("");
      setPasswordValue("");
      setConfirmPasswordValue("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      showAlert("Failed to submit data", "error");
      console.error("Failed to submit data:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>User Baru</Typography>
      </div>

      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Username</Typography>
          <FieldText
            label="Username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Email</Typography>
          <FieldText
            label="Email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            type="email"
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Password</Typography>
          <div className={styles.passwordField}>
            <FieldText
              type={showPassword ? "text" : "password"}
              label="Password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button type="button" className={styles.eyeButton} onClick={handleClickShowPassword}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Confirm Password</Typography>
          <div className={styles.passwordField}>
            <FieldText
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
            />
            <button type="button" className={styles.eyeButton} onClick={handleClickShowConfirmPassword}>
              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.buttonLabel}>
        <Button
          size="large"
          variant="confirm"
          label="Save"
          onClick={onSubmit("active")}
        />
        <Button
          size="large"
          variant="info"
          label="Save As Draft"
          onClick={onSubmit("draft")}
        />
      </div>
    </div>
  );
}
