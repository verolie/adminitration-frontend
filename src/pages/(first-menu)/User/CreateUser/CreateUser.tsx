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
  const [selectedCompany, setSelectedCompany] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { showAlert } = useAlert();

  React.useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      const company = await fetchOneCompany(token, companyId);
      setEmailValue("@" + company.unique_id);
      setSelectedCompany(company.unique_id);
    };

    fetchCompany();
  }, []);

  const onSubmit = (status: "active" | "draft") => async () => {
    const token = localStorage.getItem("token");
    try {
      if (passwordValue !== confirmPasswordValue) {
        showAlert("Password and Confirm Password do not match", "error");
        return;
      }

      const payload = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        confirmPassword: confirmPasswordValue,
        company: selectedCompany,
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
      setEmailValue("@" + selectedCompany); // Reset to default email format
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
            onChange={(e) => {
              setUsernameValue(e.target.value)
              setEmailValue(e.target.value + "@" + selectedCompany)
            }}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Email</Typography>
          <FieldText
            label="Email"
            value={emailValue}
            disabled
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
