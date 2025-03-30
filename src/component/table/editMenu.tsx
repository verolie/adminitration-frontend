import { Trash, Edit } from "lucide-react";
import styles from "./styles.module.css";
import Button from "../button/button";

interface EditMenu {
  onDelete: () => void;
  onEdit: () => void;
}

const EditMenu: React.FC<EditMenu> = ({ onDelete, onEdit }) => {
  return (
    <div className={styles.editMenu}>
      <Button
        size="medium"
        variant="alert"
        icon={<Trash size={16} />}
        onClick={onDelete}
      />
      <Button
        size="medium"
        variant="info"
        icon={<Edit size={16} />}
        onClick={onEdit}
      />
    </div>
  );
};

export default EditMenu;
