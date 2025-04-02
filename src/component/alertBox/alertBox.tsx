import { useEffect, useState } from "react";
import { CheckCircle, Error, Info } from "@mui/icons-material";
import styles from "./styles.module.css";

type AlertBoxProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export const AlertBox: React.FC<AlertBoxProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(() => {
        setVisible(false);
        onClose();
      }, 200);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.alertBox} ${closing ? styles.hidden : ""}`}>
      {type === "success" && <CheckCircle style={{ color: "#40A578" }} />}
      {type === "error" && <Error style={{ color: "#C80036" }} />}
      {type === "info" && <Info style={{ color: "#00569F" }} />}
      <span>{message}</span>
    </div>
  );
};
