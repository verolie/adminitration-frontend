import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";

const companyOptions = [
  { value: "company1", label: "Company 1" },
  { value: "company2", label: "Company 2" },
  { value: "company3", label: "Company 3" },
];

export default function CreateUser() {
  const [usernameValue, setUsernameValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState("");

  const onSubmit = (status: "active" | "draft") => () => {
    const payload = {
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
      confirmPassword: confirmPasswordValue,
      company: selectedCompany,
      status,
    };

    console.log("Submitting data:", payload);
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
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Password</Typography>
          <FieldText
            label="Password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Confirm Password</Typography>
          <FieldText
            label="Confirm Password"
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Detail Company</Typography>
      </div>

      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Company</Typography>
          <SelectedTextField
            label="Company"
            options={companyOptions}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          />
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
