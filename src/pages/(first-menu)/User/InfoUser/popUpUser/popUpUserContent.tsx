// popUpUserContent.tsx
import FieldText from "@/component/textField/fieldText";
import * as React from "react";
import styles from "./styles.module.css";
import Typography from "@mui/material/Typography";
import SelectedTextField from "@/component/textField/selectedText";

interface PopUpUserContentProps {
  data: {
    username: string;
    email: string;
    password?: string;
    company?: string;
  };
  mode: "view" | "edit";
}

const companyOptions = [
  { value: "Company A", label: "Company A" },
  { value: "Company B", label: "Company B" },
  { value: "Company C", label: "Company C" },
];

export const PopUpUserContent: React.FC<PopUpUserContentProps> = ({
  data,
  mode,
}) => {
  const [usernameValue, setUsernameValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState("");

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setUsernameValue(data.username);
      setEmailValue(data.email);
      setPasswordValue(data.password || "");
      setConfirmPasswordValue(data.password || "");
      setSelectedCompany(data.company || "");
    }
  }, [data, mode]);

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
    </div>
  );
};
