import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControl, Select, MenuItem, InputLabel, TextField } from "@mui/material";
import Button from "../../../../component/button/button";
import DatePickerField from "../../../../component/textField/dateAreaText";
import FieldText from "../../../../component/textField/fieldText";
import TableInsertManual from "../../../../component/tableInsertManual/tableInserManual";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import { createJurnalSmartax } from "../function/createJurnalSmartax";
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";
import { useAlert } from "../../../../context/AlertContext";

type RowData = {
  no: string;
  lawanTransaksi: string;
  bukti: string;
  Jumlah: string;
  kredit: string;
  keterangan: string;
};

interface AkunPerkiraanOption {
  id: string;
  nama: string;
  pajak?: {
    id: string;
    nama: string;
    persentase: number;
    is_badan_usaha: boolean;
    deskripsi?: string;
  }[];
}

interface PajakData {
  pajakId: string;
  nama: string;
  persentase: number;
}

interface PajakRowData {
  pajakId: string;
  dpp: string;
  persentase: string;
}

export default function CreateJurnalSmartax() {
  const [viewMode, setViewMode] = React.useState<'smart-tax' | 'jurnal'>('smart-tax');
  const [rows, setRows] = React.useState<RowData[]>([
    { no: "", lawanTransaksi: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" },
  ]);
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [fakturValue, setFakturValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [lawanTransaksiList, setLawanTransaksiList] = React.useState<any[]>([]);
  const [selectedLawanTransaksi, setSelectedLawanTransaksi] = React.useState<string>("");
  const [selectedPajak, setSelectedPajak] = React.useState<PajakData | null>(null);
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<AkunPerkiraanOption[]>([]);
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState<{ [key: number]: string }>({});
  const [dppValues, setDppValues] = React.useState<{ [key: number]: string }>({});
  const [pajakRows, setPajakRows] = React.useState<{ [key: number]: PajakRowData[] }>({});

  const { showAlert } = useAlert();

  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field as keyof RowData] = value;
    setRows(updatedRows);

    // When Jumlah changes, update DPP and trigger recalculation
    if (field === "Jumlah") {
      setDppValues(prev => ({
        ...prev,
        [index]: value
      }));

      // Update pajakRows if exists
      if (pajakRows[index]?.[0]) {
        const updatedPajakRows = {
          ...pajakRows,
          [index]: [{
            ...pajakRows[index][0],
            dpp: value
          }]
        };
        setPajakRows(updatedPajakRows);
      }
    }

    // Update the shared state when lawan transaksi changes in the table
    if (field === "lawanTransaksi" && index === 0) {
      setSelectedLawanTransaksi(value);
    }
  };

  const handlePajakChange = (pajak: PajakData | null) => {
    setSelectedPajak(pajak);
  };

  // Fetch Akun Perkiraan when lawan transaksi changes
  React.useEffect(() => {
    const fetchAkunPerkiraan = async () => {
      if (selectedLawanTransaksi) {
        try {
          const token = localStorage.getItem("token");
          const companyId = localStorage.getItem("companyID");
          if (!token || !companyId) return;

          const data = await fetchAkunPerkiraanDetail({ companyId }, token);
          const mappedData = data.map((a: any) => ({
            id: a.id,
            nama: `${a.kode_akun} - ${a.nama_akun}`,
            pajak: (a.objek_pajak_details || []).map((obj: any) => {
              const latestPersentase = obj.ObjekPajakDetails?.length > 0 
                ? obj.ObjekPajakDetails.sort((a: any, b: any) => 
                    new Date(b.tgl).getTime() - new Date(a.tgl).getTime()
                  )[0].persentase 
                : 0;

              return {
                id: obj.kode_objek,
                nama: obj.nama_objek,
                persentase: latestPersentase,
                is_badan_usaha: obj.akun_objek_pajak?.is_badan_usaha,
                deskripsi: obj.deskripsi_objek
              };
            }).filter((pajak: any) => pajak.persentase > 0)
          }));
          setAkunPerkiraanOptions(mappedData);
        } catch (error) {
          console.error("Error fetching akun perkiraan:", error);
        }
      }
    };

    fetchAkunPerkiraan();
  }, [selectedLawanTransaksi]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { no: "", lawanTransaksi: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  React.useEffect(() => {
    let jumlah = 0;
    let kredit = 0;

    rows.forEach((row) => {
      jumlah += parseFloat(row.Jumlah) || 0;
      kredit += parseFloat(row.kredit) || 0;
    });

    setTotalDebit(jumlah);
    setTotalKredit(kredit);
  }, [rows]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

        const data = await fetchLawanTransaksi(token, companyId);
        setLawanTransaksiList(data);
      } catch (error) {
        console.error("Error fetching lawan transaksi:", error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mengubah file menjadi base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async () => {
    if (totalDebit !== totalKredit) {
      alert("Total debit dan kredit harus seimbang.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      let fileBase64 = "";

      if (fileUpload) {
        fileBase64 = await toBase64(fileUpload);
      }

      if (companyId && token) {
        const data = {
          faktur: fakturValue,
          tgl: tanggalValue,
          totalDebit,
          totalKredit,
          companyId,
          deskripsi: deskripsiValue,
          file: fileBase64,
          jurnalDetail: rows.map((row, index) => ({
            lawanTransaksi: row.lawanTransaksi,
            bukti: row.bukti,
            debit: parseFloat(row.Jumlah) || 0,
            kredit: parseFloat(row.kredit) || 0,
            urut: index + 1,
            keterangan: row.keterangan,
          })),
        };

        const result = await createJurnalSmartax(data, token);
        alert(`Jurnal Smartax berhasil disimpan: ${result}`);
      }
    } catch (error: any) {
      alert(`Gagal menyimpan jurnal: ${error.message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const handleAkunPerkiraanChange = (rowIndex: number, akunId: string) => {
    setSelectedAkunPerkiraan(prev => ({
      ...prev,
      [rowIndex]: akunId
    }));
  };

  const handleDppChange = (rowIndex: number, value: string) => {
    setDppValues(prev => ({
      ...prev,
      [rowIndex]: value
    }));

    // Update pajakRows if exists
    if (pajakRows[rowIndex]?.[0]) {
      const updatedPajakRows = {
        ...pajakRows,
        [rowIndex]: [{
          ...pajakRows[rowIndex][0],
          dpp: value
        }]
      };
      setPajakRows(updatedPajakRows);
    }
  };

  const validateFields = () => {
    // Check first row required fields
    const firstRow = rows[0];
    const akun = akunPerkiraanOptions.find(a => a.id === selectedAkunPerkiraan[0]);
    
    if (!firstRow.lawanTransaksi || !selectedAkunPerkiraan[0] || !firstRow.Jumlah) {
      showAlert("Please fill all required fields!", "error");
      return false;
    }

    // Check if akun has pajak options and if pajak is selected
    const hasPajakOptions = akun?.pajak && akun.pajak.length > 0;
    if (hasPajakOptions) {
      if (!selectedPajak) {
        showAlert("Please select a Pajak for this Akun Perkiraan!", "error");
        return false;
      }
      
      if (!dppValues[0]) {
        showAlert("Please fill the DPP value!", "error");
        return false;
      }
    }

    return true;
  };

  const handleViewModeSwitch = () => {
    if (viewMode === 'smart-tax' && !validateFields()) {
      return;
    }
    setViewMode(viewMode === 'smart-tax' ? 'jurnal' : 'smart-tax');
  };

  const columns = React.useMemo(
    () => [
      {
        field: "lawanTransaksi" as const,
        label: "Rekening",
        type: "select" as const,
        options: lawanTransaksiList.map(item => ({
          value: item.id.toString(),
          label: item.nama
        }))
      },
      { field: "bukti" as const, label: "Bukti", type: "text" as const },
      { field: "Jumlah" as const, label: "Debit", type: "text" as const },
      { field: "kredit" as const, label: "Kredit", type: "text" as const },
      { field: "keterangan" as const, label: "Keterangan", type: "text" as const },
    ],
    [lawanTransaksiList]
  );

  // Dummy functions for disabled state
  const dummyChange = () => {};
  const dummyAddRow = () => {};
  const dummyDeleteRow = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Faktur</Typography>
        </div>
        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Tanggal</Typography>
              <DatePickerField
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value as string)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nomor Faktur</Typography>
              <FieldText
                label="Nomor Faktur"
                value={fakturValue}
                onChange={(e) => setFakturValue(e.target.value)}
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
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {viewMode === 'jurnal' && (
          <div className={styles.filterContainer}>
            <div className={styles.rowContainer}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Lawan Transaksi</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedLawanTransaksi}
                    disabled={true}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Pilih Lawan Transaksi
                    </MenuItem>
                    {lawanTransaksiList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Pajak</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedPajak?.pajakId || ""}
                    disabled={true}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Pilih Pajak
                    </MenuItem>
                    {selectedPajak && (
                      <MenuItem value={selectedPajak.pajakId}>
                        {selectedPajak.nama} ({selectedPajak.persentase}%)
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        )}

        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Jurnal</Typography>
          {viewMode === 'jurnal' && (
            <Button
              size="large"
              variant="info"
              label="Edit Jurnal"
              onClick={handleViewModeSwitch}
            />
          )}
        </div>

        {viewMode === 'smart-tax' ? (
          <TableInsertSmartTax
            rows={rows}
            lawanTransaksiList={lawanTransaksiList}
            onChange={handleRowChange}
            addRow={handleAddRow}
            deleteRow={handleDeleteRow}
            onPajakChange={handlePajakChange}
            onConfirm={handleViewModeSwitch}
            selectedAkunPerkiraan={selectedAkunPerkiraan}
            onAkunPerkiraanChange={handleAkunPerkiraanChange}
            dppValues={dppValues}
            onDppChange={handleDppChange}
            pajakRows={pajakRows}
            onPajakRowsChange={setPajakRows}
            selectedPajak={selectedPajak}
          />
        ) : (
          <>
            <TableInsertManual
              rows={rows}
              columns={columns}
              onChange={dummyChange}
              addRow={dummyAddRow}
              deleteRow={dummyDeleteRow}
              showAddButton={false}
            />
            <div className={styles.container}>
              <div className={styles.rowContainer}>
                <div className={styles.inputField}>
                  <Typography className={styles.labelText}>Total Debit</Typography>
                  <FieldText
                    label="0"
                    value={totalDebit.toString()}
                    sx={{ width: "100%" }}
                    disabled={true}
                  />
                </div>
                <div className={styles.inputField}>
                  <Typography className={styles.labelText}>Total Kredit</Typography>
                  <FieldText
                    label="0"
                    value={totalKredit.toString()}
                    sx={{ width: "100%" }}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.buttonLabel}>
        <Button
          size="large"
          variant="confirm"
          label="Save"
          onClick={onSubmit}
        />
        <Button
          size="large"
          variant="info"
          label="Save As Draft"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
} 