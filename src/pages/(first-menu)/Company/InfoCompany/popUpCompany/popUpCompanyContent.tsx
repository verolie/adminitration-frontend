import FieldText from "@/component/textField/fieldText";
import DatePickerField from "@/component/textField/dateAreaText";
import * as React from "react";
import styles from "./styles.module.css";
import Typography from "@mui/material/Typography/Typography";

interface DataRow {
  nama: string;
}

export const popUpCompanyContent = (data: DataRow, mode: "view" | "edit") => {
  const [namaValue, setNamaValue] = React.useState(data.nama);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setNamaValue(data.nama);
    }
  }, [data, mode]);

  return (
    <div className={styles.container}>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Detail Company</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Nama</Typography>
          <FieldText
            label="Nama"
            value={namaValue}
            onChange={handleNamaChange}
          ></FieldText>
        </div>
      </div>
    </div>
  );
};
