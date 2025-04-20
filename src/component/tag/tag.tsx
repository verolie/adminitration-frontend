import { Cancel } from "@mui/icons-material";
import styles from "./styles.module.css";

type TagWithCancelProps = {
  label: string;
  onCancel: () => void;
};

const Tag = ({ label, onCancel }: TagWithCancelProps) => {
  return (
    <div className={styles.tag}>
      <p className={styles.label}>{label}</p>
      <Cancel className={styles.cancelIcon} onClick={onCancel} />
    </div>
  );
};

export default Tag;
