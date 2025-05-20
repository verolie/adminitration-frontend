import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import Button from "../../../../component/button/button";
import DatePickerField from "../../../../component/textField/dateAreaText";
import FieldText from "../../../../component/textField/fieldText";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import TableInsertManual from "../../../../component/tableInsertManual/tableInserManual";
import { editJurnalSmartax } from "../function/editJurnalSmartax";   
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";
import { fetchSmartTaxID } from "../function/fetchSmartTaxID";
import { fetchAkunPerkiraanAll } from "../function/fetchAkunPerkiraanAll";
import { useAlert } from "../../../../context/AlertContext";

interface EditJurnalSmartaxProps {
  id: string;
  onClose: () => void;
}

type RowData = {
  no: string;
  akunPerkiraan: string;
  lawanTransaksi: string;
  bukti: string;
  Jumlah: string;
  kredit: string;
  keterangan: string;
};

export default function EditJurnalSmartax({ id, onClose }: EditJurnalSmartaxProps) {
  const [viewMode, setViewMode] = React.useState<'smart-tax' | 'jurnal'>('jurnal');
  const [rows, setRows] = React.useState<RowData[]>([
    { no: "", akunPerkiraan: "", lawanTransaksi: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" },
  ]);
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [fakturValue, setFakturValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [lawanTransaksiList, setLawanTransaksiList] = React.useState<any[]>([]);
  const [selectedLawanTransaksi, setSelectedLawanTransaksi] = React.useState("");
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState<{ [key: number]: string }>({});
  const [dppValues, setDppValues] = React.useState<{ [key: number]: string }>({});
  const [pajakRows, setPajakRows] = React.useState<{ [key: number]: any[] }>({});
  const [selectedPajak, setSelectedPajak] = React.useState<{ pajakId: string; nama: string; persentase: number; } | null>(null);
  const [totalPajak, setTotalPajak] = React.useState(0);
  const [totalSetelahPajak, setTotalSetelahPajak] = React.useState(0);
  const [totalJumlah, setTotalJumlah] = React.useState(0);
  const [allAkunPerkiraanOptions, setAllAkunPerkiraanOptions] = React.useState<any[]>([]);
  const [isLoadingRekening, setIsLoadingRekening] = React.useState(false);

  const { showAlert } = useAlert();

  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field as keyof RowData] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { no: "", akunPerkiraan: "", lawanTransaksi: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" },
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

  // Fetch all Akun Perkiraan for jurnal view
  React.useEffect(() => {
    const fetchAllAkunPerkiraan = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

        const data = await fetchAkunPerkiraanAll({ companyId }, token);
        setAllAkunPerkiraanOptions(data.map((item: any) => ({
          id: item.id,
          nama: `${item.kode_akun} - ${item.nama_akun}`
        })));
      } catch (error) {
        console.error("Error fetching all akun perkiraan:", error);
        showAlert("Failed to fetch akun perkiraan", "error");
      }
    };

    fetchAllAkunPerkiraan();
  }, [showAlert]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

        const [jurnalData, lawanTransaksiData] = await Promise.all([
          fetchSmartTaxID(companyId, id, token),
          fetchLawanTransaksi(token, companyId)
        ]);

        setTanggalValue(jurnalData.tgl);
        setFakturValue(jurnalData.faktur);
        setDeskripsiValue(jurnalData.deskripsi || "");
        setSelectedLawanTransaksi(jurnalData.id_lawan_transaksi?.toString() || "");
        setTotalDebit(jurnalData.total_debit);
        setTotalKredit(jurnalData.total_kredit);
        setTotalPajak(jurnalData.jumlah_pajak || 0);
        setTotalJumlah(jurnalData.total_debit);
        setTotalSetelahPajak(jurnalData.total_debit - (jurnalData.jumlah_pajak || 0));

        // Set rows from JurnalDetails
        setRows(
          jurnalData.JurnalDetails.map((detail: any) => ({
            no: "",
            akunPerkiraan: detail.id_akun_perkiraan_detail?.toString() || "",
            lawanTransaksi: detail.id_akun_perkiraan_detail?.toString() || "",
            bukti: detail.bukti || "",
            Jumlah: detail.debit?.toString() || "0",
            kredit: detail.kredit?.toString() || "0",
            keterangan: detail.keterangan || "",
          }))
        );

        // Set selected akun perkiraan
        const akunPerkiraanMap: { [key: number]: string } = {};
        jurnalData.JurnalDetails.forEach((detail: any, index: number) => {
          if (detail.id_akun_perkiraan_detail) {
            akunPerkiraanMap[index] = detail.id_akun_perkiraan_detail.toString();
          }
        });
        setSelectedAkunPerkiraan(akunPerkiraanMap);

        // Set DPP values if available
        if (jurnalData.dpp) {
          setDppValues({ 0: jurnalData.dpp.toString() });
        }

        // Set pajak rows if available
        if (jurnalData.id_objek_pajak && jurnalData.persentase_pajak) {
          setPajakRows({
            0: [{
              pajakId: jurnalData.id_objek_pajak.toString(),
              dpp: jurnalData.dpp?.toString() || jurnalData.total_debit.toString(),
              persentase: jurnalData.persentase_pajak.toString()
            }]
          });
          setSelectedPajak({
            pajakId: jurnalData.id_objek_pajak.toString(),
            nama: "", // You might want to fetch the name from somewhere
            persentase: jurnalData.persentase_pajak
          });
        }

        setLawanTransaksiList(lawanTransaksiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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
          id,
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

        const result = await editJurnalSmartax(data, token);
        alert(`Jurnal Smartax berhasil diperbarui: ${result}`);
        onClose();
      }
    } catch (error: any) {
      alert(`Gagal memperbarui jurnal: ${error.message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const handleViewModeSwitch = () => {
    setViewMode(viewMode === 'jurnal' ? 'smart-tax' : 'jurnal');
  };

  const columns = React.useMemo(
    () => [
      {
        field: "akunPerkiraan" as const,
        label: "Rekening",
        type: "select" as const,
        options: allAkunPerkiraanOptions.map(item => ({
          value: item.id,
          label: item.nama
        }))
      },
      { field: "bukti" as const, label: "Bukti", type: "text" as const },
      { field: "Jumlah" as const, label: "Debit", type: "text" as const },
      { field: "kredit" as const, label: "Kredit", type: "text" as const },
      { field: "keterangan" as const, label: "Keterangan", type: "text" as const },
    ],
    [allAkunPerkiraanOptions]
  );

  // Dummy functions for disabled state
  const dummyChange = () => {};
  const dummyAddRow = () => {};
  const dummyDeleteRow = () => {};

  const formatRupiah = (value: number | string) => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(number)) return "Rp 0";
    return `Rp ${number.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatNumber = (value: number | string) => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(number)) return "0";
    return number.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

        {isLoadingRekening ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          viewMode === 'smart-tax' ? (
            <TableInsertSmartTax
              rows={rows}
              lawanTransaksiList={lawanTransaksiList}
              selectedLawanTransaksi={selectedLawanTransaksi}
              onLawanTransaksiChange={setSelectedLawanTransaksi}
              onChange={handleRowChange}
              addRow={handleAddRow}
              deleteRow={handleDeleteRow}
              onPajakChange={setSelectedPajak}
              onConfirm={onSubmit}
              selectedAkunPerkiraan={selectedAkunPerkiraan}
              onAkunPerkiraanChange={(rowIndex, akunId) => setSelectedAkunPerkiraan(prev => ({ ...prev, [rowIndex]: akunId }))}
              dppValues={dppValues}
              onDppChange={(rowIndex, value) => setDppValues(prev => ({ ...prev, [rowIndex]: value }))}
              pajakRows={pajakRows}
              onPajakRowsChange={setPajakRows}
              selectedPajak={selectedPajak}
              totalPajak={totalPajak}
              totalSetelahPajak={totalSetelahPajak}
              totalJumlah={totalJumlah}
              onTotalChange={(pajak, setelahPajak, jumlah) => {
                setTotalPajak(pajak);
                setTotalSetelahPajak(setelahPajak);
                setTotalJumlah(jumlah);
              }}
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
              <div className={styles.filterContainer}>
                <div className={styles.rowContainer}>
                  <div className={styles.inputField}>
                    <Typography className={styles.labelText}>Total Debit</Typography>
                    <FieldText
                      label="0"
                      value={formatNumber(totalDebit)}
                      sx={{ width: "100%" }}
                      disabled={true}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <Typography className={styles.labelText}>Total Kredit</Typography>
                    <FieldText
                      label="0"
                      value={formatNumber(totalKredit)}
                      sx={{ width: "100%" }}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </>
          )
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