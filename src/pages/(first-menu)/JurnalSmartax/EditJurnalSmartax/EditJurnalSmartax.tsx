import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import Button from "../../../../component/button/button";
import DatePickerField from "../../../../component/textField/dateAreaText";
import FieldText from "../../../../component/textField/fieldText";
import TableInsertManual from "../../../../component/tableInsertManual/tableInserManual";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import { fetchAkunPerkiraanAll } from "../function/fetchAkunPerkiraanAll";
import { useAlert } from "../../../../context/AlertContext";
import { fetchAkunHutangPajak } from "../function/fetchAkunHutangPajak";
import { fetchLawanTransaksiById } from "../function/fetchLawanTransaksiById ";
import { fetchSmartTaxID } from "../function/fetchSmartTaxID";
import { editJurnalSmartax } from "../function/editJurnalSmartax";

// Types
// ... (copy types from CreateJurnalSmartax)
type RowData = {
  no: string;
  akunPerkiraan: string;
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
function parseInputNumber(str: string): number {
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

interface EditJurnalSmartaxProps {
  id: string;
  onClose: () => void;
}

export default function EditJurnalSmartax({ id, onClose }: EditJurnalSmartaxProps) {
  // State (identical to CreateJurnalSmartax)
  const [viewMode, setViewMode] = React.useState<'smart-tax' | 'jurnal'>('smart-tax');
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);
  const [rows, setRows] = React.useState<RowData[]>([
    { no: "", akunPerkiraan: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" },
  ]);
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [totalPajak, setTotalPajak] = React.useState(0);
  const [totalSetelahPajak, setTotalSetelahPajak] = React.useState(0);
  const [totalJumlah, setTotalJumlah] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [fakturValue, setFakturValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [lawanTransaksiList, setLawanTransaksiList] = React.useState<any[]>([]);
  const [selectedLawanTransaksi, setSelectedLawanTransaksi] = React.useState<string>("");
  const [selectedPajak, setSelectedPajak] = React.useState<PajakData | null>(null);
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<AkunPerkiraanOption[]>([]);
  const [allAkunPerkiraanOptions, setAllAkunPerkiraanOptions] = React.useState<AkunPerkiraanOption[]>([]);
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState<{ [key: number]: string }>({});
  const [dppValues, setDppValues] = React.useState<{ [key: number]: string }>({});
  const [pajakRows, setPajakRows] = React.useState<{ [key: number]: PajakRowData[] }>({});
  const [isLoadingRekening, setIsLoadingRekening] = React.useState(false);
  const [akunHutangPajak, setAkunHutang] = React.useState<number | null>(null);
  const [akunLawanBeban, setAkunLawanBeban] = React.useState<number | null>(null);
  const { showAlert } = useAlert();
  const [backendPajak, setBackendPajak] = React.useState<{ pajakId: string, dpp: string, persentase: number } | null>(null);

  // Fetch and prefill data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId || !id) return;
        // Fetch jurnal data
        const data = await fetchSmartTaxID(companyId, id, token);
        setFakturValue(data.faktur || "");
        setTanggalValue(data.tgl || "");
        setDeskripsiValue(data.deskripsi || "");
        setSelectedLawanTransaksi(data.id_lawan_transaksi?.toString() || "");
        console.log(data.id_objek_pajak);
        if (data.id_objek_pajak) {
          setBackendPajak({
            pajakId: data.id_objek_pajak.toString(),
            dpp: data.dpp ? data.dpp.toString() : "",
            persentase: data.persentase_pajak || 0
          });
        }
        setDppValues({ 0: data.dpp ? data.dpp.toString() : "" });
        setTotalPajak(data.jumlah_pajak || 0);
        setTotalDebit(data.total_debit || 0);
        setTotalKredit(data.total_kredit || 0);
        // Map JurnalDetails to rows
        if (data.JurnalDetails && data.JurnalDetails.length > 0) {
          const mappedRows = data.JurnalDetails.map((detail: any, idx: number) => ({
            no: (idx + 1).toString(),
            akunPerkiraan: detail.id_akun_perkiraan_detail?.toString() || "",
            bukti: detail.bukti || "",
            Jumlah: detail.debit > 0 ? detail.debit.toString() : "",
            kredit: detail.kredit > 0 ? detail.kredit.toString() : "",
            keterangan: detail.keterangan || "",
          }));
          setRows(mappedRows);
          setSelectedAkunPerkiraan({ 0: mappedRows[0]?.akunPerkiraan || "" });
        }
      } catch (error) {
        showAlert("Gagal mengambil data jurnal", "error");
      }
    };
    fetchData();
  }, [id, showAlert]);

  // Fetch lawan transaksi list
  React.useEffect(() => {
    const fetchLawan = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;
        const data = await fetchLawanTransaksi(token, companyId);
        setLawanTransaksiList(data);
      } catch (error) {
        showAlert("Gagal mengambil lawan transaksi", "error");
      }
    };
    fetchLawan();
  }, [showAlert]);

  // Fetch akun perkiraan detail when lawan transaksi changes
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
                id: String(obj.id),
                nama: obj.nama_objek,
                persentase: latestPersentase,
                is_badan_usaha: obj.akun_objek_pajak?.is_badan_usaha,
                deskripsi: obj.deskripsi_objek
              };
            }).filter((pajak: any) => pajak.persentase > 0)
          }));
          setAkunPerkiraanOptions(mappedData);
        } catch (error) {
          //
        }
      }
    };
    fetchAkunPerkiraan();
  }, [selectedLawanTransaksi]);

  // Fetch all akun perkiraan for jurnal view
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
        showAlert("Failed to fetch akun perkiraan", "error");
      }
    };
    fetchAllAkunPerkiraan();
  }, [showAlert]);

  // Prefill selectedPajak & pajakRows setelah akunPerkiraanOptions dan selectedAkunPerkiraan siap
  React.useEffect(() => {
    if (
      backendPajak &&
      akunPerkiraanOptions.length > 0 &&
      selectedAkunPerkiraan[0]
    ) {
      const akun = akunPerkiraanOptions.find(a => a.id === selectedAkunPerkiraan[0]);
      const pajak = akun?.pajak?.find(p => p.id === backendPajak.pajakId);
      // Debug log
      console.log('Akun:', akun);
      console.log('Daftar pajak:', akun?.pajak);
      console.log('Backend pajak id:', backendPajak?.pajakId);
      if (pajak) {
        setSelectedPajak({
          pajakId: pajak.id,
          nama: pajak.nama,
          persentase: pajak.persentase
        });
          setPajakRows({
            0: [{
            pajakId: pajak.id,
            dpp: backendPajak.dpp || dppValues[0] || rows[0]?.Jumlah || "0",
            persentase: pajak.persentase.toString()
            }]
          });
      }
      setBackendPajak(null); // Hanya jalankan sekali
    }
  }, [backendPajak, akunPerkiraanOptions, selectedAkunPerkiraan, dppValues, rows]);

  // Handlers (identical to CreateJurnalSmartax)
  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field as keyof RowData] = value;
    setRows(updatedRows);
    if (field === "Jumlah") {
      setDppValues(prev => ({ ...prev, [index]: value }));
      if (pajakRows[index]?.[0]) {
        const updatedPajakRows = {
          ...pajakRows,
          [index]: [{ ...pajakRows[index][0], dpp: value }]
        };
        setPajakRows(updatedPajakRows);
      }
    }
    if (field === "akunPerkiraan" && index === 0) {
      setSelectedLawanTransaksi(value);
    }
  };
  const handlePajakChange = (pajak: PajakData | null) => setSelectedPajak(pajak);
  const handleAddRow = () => setRows([...rows, { no: "", akunPerkiraan: "", bukti: "", Jumlah: "", kredit: "", keterangan: "" }]);
  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileUpload(file);
  };
  const handleAkunPerkiraanChange = (rowIndex: number, akunId: string) => setSelectedAkunPerkiraan(prev => ({ ...prev, [rowIndex]: akunId }));
  const handleDppChange = (rowIndex: number, value: string) => {
    setDppValues(prev => ({ ...prev, [rowIndex]: value }));
    if (pajakRows[rowIndex]?.[0]) {
      const updatedPajakRows = {
        ...pajakRows,
        [rowIndex]: [{ ...pajakRows[rowIndex][0], dpp: value }]
      };
      setPajakRows(updatedPajakRows);
    }
  };
  const handleLawanTransaksiChange = (value: string) => setSelectedLawanTransaksi(value);
  const handleTotalChange = React.useCallback((newTotalPajak: number, newTotalSetelahPajak: number, newTotalJumlah: number) => {
    setTotalPajak(newTotalPajak);
    setTotalSetelahPajak(newTotalSetelahPajak);
    setTotalJumlah(newTotalJumlah);
  }, []);

  // Confirm & view mode logic (identical)
  const validateFields = () => {
    const firstRow = rows[0];
    const akun = akunPerkiraanOptions.find(a => a.id === selectedAkunPerkiraan[0]);
    if (!selectedLawanTransaksi || !selectedAkunPerkiraan[0] || !firstRow.Jumlah) {
      showAlert("Please fill all required fields!", "error");
      return false;
    }
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
    if (viewMode === 'smart-tax' && !validateFields()) return;
    setViewMode(viewMode === 'smart-tax' ? 'jurnal' : 'smart-tax');
  };
  const handleConfirm = async () => {
    try {
      setIsConfirmLoading(true);
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;
      const akunHutang = await fetchAkunHutangPajak(selectedPajak?.pajakId || "", companyId, token);
      setAkunHutang(akunHutang.akun_perkiraan_hutang_details[0].id);
      const akunLawanBeban = await fetchLawanTransaksiById(companyId, parseInt(selectedLawanTransaksi));
      setAkunLawanBeban(akunLawanBeban.akun_hutang.id);
      handleViewModeSwitch();
    } catch (error) {
      showAlert('Failed to process confirmation', 'error');
    } finally {
      setIsConfirmLoading(false);
    }
  };

  // Format & mapping helpers
  const formatRupiah = (value: number | string) => {
    const number = typeof value === "string"
      ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
      : value;
    if (isNaN(number)) return "0";
    return number.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const getJurnalViewData = () => {
    const firstRow = rows[0];
    return [
      {
        ...firstRow,
        akunPerkiraan: selectedAkunPerkiraan[0] || "",
        kredit: "0"
      },
      {
        no: "",
        akunPerkiraan: akunHutangPajak?.toString() || "",
        bukti: "",
        Jumlah: "0",
        kredit: formatRupiah(totalPajak).replace("Rp ", ""),
        keterangan: ""
      },
      {
        no: "",
        akunPerkiraan: akunLawanBeban?.toString() || "",
        bukti: "",
        Jumlah: "0",
        kredit: formatRupiah(totalSetelahPajak).replace("Rp ", ""),
        keterangan: ""
      }
    ];
  };

  // Submit logic (use editJurnalSmartax)
  const onSubmit = async () => {
    if (totalDebit !== totalKredit) {
      alert("Total debit dan kredit harus seimbang.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;
        const data = {
          id,
          faktur: fakturValue,
          tgl: tanggalValue,
        total_debit: totalDebit.toString(),
        total_kredit: totalKredit.toString(),
        lawan_transaksi_id: selectedLawanTransaksi,
        objek_pajak_id: selectedPajak?.pajakId || '',
        jumlah_pajak: totalPajak ? totalPajak.toString() : 'null',
        persentase_pajak: selectedPajak?.persentase?.toString() || 'null',
        dpp: dppValues[0].toString() || 'null',
        is_smart_tax: true,
        file: fileUpload || undefined,
        company_id: companyId,
        deskripsi: deskripsiValue || '',
        jurnal_detail: JSON.stringify(
          (viewMode === 'jurnal' ? getJurnalViewData() : rows).map((row, index) => ({
            akun_perkiraan_detail_id: row.akunPerkiraan,
            bukti: row.bukti,
            debit: parseInputNumber(row.Jumlah) || 0,
            kredit: parseInputNumber(row.kredit) || 0,
            urut: index + 1,
            keterangan: row.keterangan,
          }))
        )
      };
      await editJurnalSmartax(data, token);
      showAlert("Jurnal Smartax berhasil diupdate", "success");
    } catch (error: any) {
      showAlert(`Gagal update jurnal: ${error.message}`, "error");
    }
  };

  // Columns for TableInsertManual
  const columns = React.useMemo(
    () => [
      {
        field: "akunPerkiraan" as const,
        label: "Rekening",
        type: "select" as const,
        options: viewMode === 'jurnal' ? allAkunPerkiraanOptions.map(item => ({
          value: item.id,
          label: item.nama
        })) : []
      },
      { field: "bukti" as const, label: "Bukti", type: "text" as const },
      { field: "Jumlah" as const, label: "Debit", type: "text" as const },
      { field: "kredit" as const, label: "Kredit", type: "text" as const },
      { field: "keterangan" as const, label: "Keterangan", type: "text" as const },
    ],
    [viewMode, allAkunPerkiraanOptions]
  );
  const dummyChange = () => {};
  const dummyAddRow = () => {};
  const dummyDeleteRow = () => {};

  // Render (identical to CreateJurnalSmartax)
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
              onLawanTransaksiChange={handleLawanTransaksiChange}
              onChange={handleRowChange}
              addRow={handleAddRow}
              deleteRow={handleDeleteRow}
              onPajakChange={handlePajakChange}
              onConfirm={handleConfirm}
              selectedAkunPerkiraan={selectedAkunPerkiraan}
              onAkunPerkiraanChange={handleAkunPerkiraanChange}
              dppValues={dppValues}
              onDppChange={handleDppChange}
              pajakRows={pajakRows}
              onPajakRowsChange={setPajakRows}
              selectedPajak={selectedPajak}
              totalPajak={totalPajak}
              totalSetelahPajak={totalSetelahPajak}
              totalJumlah={totalJumlah}
              onTotalChange={handleTotalChange}
            />
          ) : (
            <>
              <TableInsertManual
                rows={getJurnalViewData().map(row => ({
                  ...row,
                  Jumlah: formatRupiah(row.Jumlah),
                  kredit: formatRupiah(row.kredit),
                }))}
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
                      value={formatRupiah(totalDebit)}
                      sx={{ width: "100%" }}
                      disabled={true}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <Typography className={styles.labelText}>Total Kredit</Typography>
                    <FieldText
                      label="0"
                      value={formatRupiah(totalKredit)}
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
