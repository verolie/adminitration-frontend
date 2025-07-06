import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";
import TableInsertManual from "@/component/tableInsertManual/tableInserManual";
import { createJurnalUmum } from "../function/createJurnalUmum";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import { JurnalUmum } from "../model/JurnalUmumModel";
import { useAlert } from "@/context/AlertContext";
import ModalConfirm from '@/component/confirmModalPopup/confirmModalPopup';
import { useAppContext } from '@/context/context';
import { formatRupiah } from "@/utils/formatNumber";

type RowData = {
  no: string;
  rekening: string;
  bukti: string;
  debit: string;
  kredit: string;
  keterangan: string;
};

type Column<T> = {
  field: keyof T;
  label: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string }[]; // Only for "select" type
  onBlur?: (value: string) => string;
};

export default function DataBaru() {
  const [kodeAkunValue, setKodeAkunValue] = React.useState("");
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [buktiValue, setBuktiValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState(""); // State untuk Deskripsi
  const [fileUpload, setFileUpload] = React.useState<File | null>(null); // State untuk File Upload
  const [rows, setRows] = React.useState<RowData[]>([
    {
      no: "",
      rekening: "",
      bukti: "",
      debit: "",
      kredit: "",
      keterangan: "",
    },
  ]);
  const [akunOptions, setAkunOptions] = React.useState<{ value: string; label: string; has_akun_objek_pajak?: boolean }[]>([]);
  const [showSmartaxModal, setShowSmartaxModal] = React.useState(false);
  const { addTab, handleTabChange } = useAppContext();

  const columns: Column<RowData>[] = React.useMemo(
    () => [
      {
        field: "rekening",
        label: "Rekening",
        type: "select",
        options: akunOptions,
      },
      { field: "bukti", label: "Bukti", type: "text" },
      { 
        field: "debit", 
        label: "Debit", 
        type: "text",
        onBlur: (value: string) => formatRupiah(value)
      },
      { 
        field: "kredit", 
        label: "Kredit", 
        type: "text",
        onBlur: (value: string) => formatRupiah(value)
      },
      { field: "keterangan", label: "Keterangan", type: "text" },
    ],
    [akunOptions]
  );

  const { showAlert } = useAlert();

  React.useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");

        if (!token || !companyId) return;

        const data = await fetchAkunPerkiraanDetail(
          { companyId }, // pastikan AkunPerkiraan hanya butuh ini
          token
        );

        console.log("contoh ", data);
        const akunList = data.map((akun: any) => ({
          value: akun.id.toString(),
          label: `${akun.kode_akun} - ${akun.nama_akun}`,
          has_akun_objek_pajak: akun.has_akun_objek_pajak,
        }));

        setAkunOptions(akunList);
      } catch (err) {
        console.error("Gagal fetch akun:", err);
      }
    };

    fetchAkun();
  }, []);
  const handleRowChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    if (field === 'rekening') {
      const akun = akunOptions.find(a => a.value === value);
      if (akun && akun.has_akun_objek_pajak) {
        setShowSmartaxModal(true);
        return;
      }
    }

    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        no: "",
        rekening: "",
        bukti: "",
        debit: "",
        kredit: "",
        keterangan: "",
      },
    ]);
  };

  React.useEffect(() => {
    let debit = 0;
    let kredit = 0;

    rows.forEach((row) => {
      // Parse the formatted numbers
      const debitNum = parseFloat(row.debit.replace(/\./g, '').replace(',', '.')) || 0;
      const kreditNum = parseFloat(row.kredit.replace(/\./g, '').replace(',', '.')) || 0;
      
      debit += debitNum;
      kredit += kreditNum;
    });

    setTotalDebit(debit);
    setTotalKredit(kredit);
  }, [rows]);

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  // Fungsi untuk mengubah file menjadi base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  function parseIndoNumber(str: string) {
    if (!str) return 0;
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
  }

  const onSubmit = (status: "active" | "submit") => async () => {
    if (totalDebit !== totalKredit) {
      showAlert("Total debit dan kredit harus seimbang.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");

      if (companyId && token) {
        const data: JurnalUmum = {
          faktur: kodeAkunValue,
          tgl: tanggalValue,
          totalDebit: totalDebit,
          totalKredit: totalKredit,
          companyId: companyId,
          deskripsi: deskripsiValue,
          file: fileUpload || undefined,
          is_smart_tax: false,
          lawan_transaksi_id: "",
          objek_pajak_id: "",
          jumlah_pajak: 0,
          persentase_pajak: 0,
          dpp: 0,
          jurnalDetail: rows.map((row, index) => ({
            akunPerkiraanDetailId: Number(row.rekening),
            bukti: row.bukti,
            debit: parseIndoNumber(row.debit),
            kredit: parseIndoNumber(row.kredit),
            urut: index + 1,
            keterangan: row.keterangan,
          })),
        };

        const result = await createJurnalUmum(data, token);
        showAlert(`Jurnal berhasil disimpan: ${result}`, "success");
      }
    } catch (error: any) {
      showAlert(`Gagal menyimpan jurnal: ${error.message}`, "error");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        showAlert('File harus berupa PDF, JPEG, PNG, atau Word', "error");
        event.target.value = '';
        return;
      }
      setFileUpload(file);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Faktur</Typography>
        </div>
        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nomor Faktur</Typography>
              <FieldText
                label="Nomor Faktur"
                value={kodeAkunValue}
                onChange={(e) => setKodeAkunValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Tanggal</Typography>
              <DatePickerField
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Deskripsi</Typography>
              <FieldText
                label="Deskripsi"
                value={deskripsiValue}
                onChange={(e) => setDeskripsiValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Upload File</Typography>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Atur jenis file yang diterima
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Jurnal</Typography>
        </div>
        <TableInsertManual
          rows={rows}
          onChange={handleRowChange}
          addRow={handleAddRow}
          deleteRow={handleDeleteRow}
          columns={columns}
        />

        <div className={styles.container}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Debit</Typography>
              <FieldText
                label="0"
                value={formatRupiah(totalDebit)}
                onChange={(e) => setKodeAkunValue(e.target.value)}
                sx={{ width: "100%" }}
                disabled={true}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Kredit</Typography>
              <FieldText
                label="0"
                value={formatRupiah(totalKredit)}
                onChange={(e) => setKodeAkunValue(e.target.value)}
                sx={{ width: "100%" }}
                disabled={true}
              />
            </div>
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
          onClick={onSubmit("submit")}
        />
      </div>

      <ModalConfirm
        open={showSmartaxModal}
        onClose={() => setShowSmartaxModal(false)}
        onConfirm={() => {
          addTab('Jurnal Smartax');
          handleTabChange(1);
          setShowSmartaxModal(false);
        }}
        title="Akun ini memiliki pajak"
        description="Akun ini memiliki pajak, ingin beralih ke jurnal smartax?"
        confirmLabel="OK"
        cancelLabel="Batal"
        confirmColor="blue"
      />
    </div>
  );
}
