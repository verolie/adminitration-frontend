import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControl, Select, MenuItem, InputLabel, TextField, CircularProgress } from "@mui/material";
import Button from "../../../component/button/button";
import DatePickerField from "../../../component/textField/dateAreaText";
import FieldText from "../../../component/textField/fieldText";
import TableInsertManual from "../../../component/tableInsertManual/tableInserManual";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import { createJurnalSmartax } from "../function/createJurnalSmartax";
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import type { AkunPerkiraanItem } from "../function/fetchAkunPerkiraanAll";
import { fetchAkunPerkiraanAll } from "../function/fetchAkunPerkiraanAll";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";
import { useAlert } from "../../../context/AlertContext";
import { fetchAkunHutangPajak } from "../function/fetchAkunHutangPajak";
import { fetchLawanTransaksiById } from "../function/fetchLawanTransaksiById ";
import { formatRupiah, parseInputNumber } from "@/utils/formatNumber";

type RowData = {
  no: string;
  akunPerkiraan: string;
  Jumlah: string;
  kredit: string;
  keterangan: string;
  isSmartTax: boolean;
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

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

interface TransactionData {
  akunPerkiraan: string;
  dpp: string;
  pajak: {
    pajakId: string;
    nama: string;
    persentase: number;
    nilai: number;
  } | null;
  jumlah: string;
  keterangan: string;
  isSmartTax: boolean;
}

export default function CreateJurnalSmartax() {
  const [viewMode, setViewMode] = React.useState<'smart-tax' | 'jurnal'>('smart-tax');
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);
  const [rows, setRows] = React.useState<RowData[]>([
    { no: "", akunPerkiraan: "", Jumlah: "", kredit: "", keterangan: "", isSmartTax: false },
  ]);
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [totalPajak, setTotalPajak] = React.useState(0);
  const [totalSetelahPajak, setTotalSetelahPajak] = React.useState(0);
  const [totalJumlah, setTotalJumlah] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState(() => new Date().toISOString().slice(0, 10));
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
  const [transactions, setTransactions] = React.useState<TransactionData[]>([{
    akunPerkiraan: '',
    dpp: '0',
    pajak: null,
    jumlah: '0',
    keterangan: '',
    isSmartTax: false
  }]);
  const [jurnalData, setJurnalData] = React.useState<RowData[]>([]);
  const [manualRows, setManualRows] = React.useState<RowData[]>([]);

  const { showAlert } = useAlert();

  const handleRowChange = (index: number, field: keyof RowData, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    // Recalculate totals
    const totalDebit = newRows.reduce((sum, row) => sum + parseInputNumber(row.Jumlah), 0);
    const totalKredit = newRows.reduce((sum, row) => sum + parseInputNumber(row.kredit), 0);
    setTotalDebit(totalDebit);
    setTotalKredit(totalKredit);
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

  // Fetch all Akun Perkiraan for jurnal view
  React.useEffect(() => {
    const fetchAllAkunPerkiraan = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

        const data = await fetchAkunPerkiraanAll({ companyId }, token);
        setAllAkunPerkiraanOptions(data.map((item: AkunPerkiraanItem) => ({
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

  const handleAddRow = () => {
    setRows([
      ...rows,
      { no: "", akunPerkiraan: "", Jumlah: "", kredit: "", keterangan: "", isSmartTax: false },
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

    setTotalDebit(totalJumlah);
    setTotalKredit(totalPajak + totalSetelahPajak);
  }, [rows, viewMode]);

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

  const onSubmit = async () => {
    if (totalDebit !== totalKredit) {
      showAlert("Total debit dan kredit harus seimbang.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      // fileUpload sudah File, tidak perlu base64
      if (token) {
        const data = {
          faktur: fakturValue,
          tgl: tanggalValue,
          total_debit: totalDebit.toString(),
          total_kredit: totalKredit.toString(),
          lawan_transaksi_id: selectedLawanTransaksi,
          is_smart_tax: true,
          deskripsi: deskripsiValue,
          jurnal_detail: JSON.stringify(
            (viewMode === 'jurnal' ? jurnalData : rows).map((row, index) => {
              // For jurnal mode, handle smart-tax and manual rows differently
              if (viewMode === 'jurnal') {
                if (row.isSmartTax) {
                  // Find corresponding transaction for smart-tax rows
                  const transaction = transactions.find(t => t.akunPerkiraan === row.akunPerkiraan);
                  return {
                    akun_perkiraan_detail_id: row.akunPerkiraan,
                    debit: parseInputNumber(row.Jumlah) || 0,
                    kredit: parseInputNumber(row.kredit) || 0,
                    urut: index + 1,
                    keterangan: row.keterangan,
                    dpp: transaction?.dpp ? parseInputNumber(transaction.dpp) : null,
                    persentase_pajak: transaction?.pajak?.persentase || null,
                    jumlah_pajak: transaction?.pajak?.nilai || null,
                    objek_pajak_id: transaction?.pajak?.pajakId || null
                  };
                } else {
                  // Manual rows don't have tax data
                  return {
                    akun_perkiraan_detail_id: row.akunPerkiraan,
                    debit: parseInputNumber(row.Jumlah) || 0,
                    kredit: parseInputNumber(row.kredit) || 0,
                    urut: index + 1,
                    keterangan: row.keterangan,
                    dpp: null,
                    persentase_pajak: null,
                    jumlah_pajak: null,
                    objek_pajak_id: null
                  };
                }
              } else {
                // Smart-tax mode - original logic
                const transaction = transactions[index];
                return {
                  akun_perkiraan_detail_id: row.akunPerkiraan,
                  debit: parseInputNumber(row.Jumlah) || 0,
                  kredit: parseInputNumber(row.kredit) || 0,
                  urut: index + 1,
                  keterangan: row.keterangan,
                  dpp: transaction?.dpp ? parseInputNumber(transaction.dpp) : null,
                  persentase_pajak: transaction?.pajak?.persentase || null,
                  jumlah_pajak: transaction?.pajak?.nilai || null,
                  objek_pajak_id: transaction?.pajak?.pajakId || null
                };
              }
            })
          ),
          file: fileUpload || undefined,
          company_id: companyId || ""
        };

        const result = await createJurnalSmartax(data, token);
        showAlert(`Jurnal Smartax berhasil disimpan: ${result}`, "success");
      }
    } catch (error: any) {
      showAlert(`Gagal menyimpan jurnal: ${error.message}`, "error");
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
    // Check if there are any transactions
    if (transactions.length === 0) {
      showAlert("Please add at least one transaction!", "error");
      return false;
    }

    // Check if lawan transaksi is selected
    if (!selectedLawanTransaksi) {
      showAlert("Please select a Lawan Transaksi!", "error");
      return false;
    }

    // Validate each transaction
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const akun = akunPerkiraanOptions.find(a => a.id === transaction.akunPerkiraan);

      // Check required fields for each transaction
      if (!transaction.akunPerkiraan) {
        showAlert(`Please select an Akun Perkiraan for transaction ${i + 1}!`, "error");
        return false;
      }

      // Check jumlah is not empty and not 0
      const jumlahValue = parseInputNumber(transaction.jumlah);
      if (!transaction.jumlah || jumlahValue <= 0) {
        showAlert(`Jumlah must be greater than 0 for transaction ${i + 1}!`, "error");
        return false;
      }

      // Check if akun has pajak options and if pajak is selected
      const hasPajakOptions = akun?.pajak && akun.pajak.length > 0;
      if (hasPajakOptions) {
        if (!transaction.pajak) {
          showAlert(`Please select a Pajak for transaction ${i + 1}!`, "error");
          return false;
        }
        
        if (!transaction.dpp) {
          showAlert(`Please fill the DPP value for transaction ${i + 1}!`, "error");
          return false;
        }
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

  const handleConfirm = async () => {
    try {
      setIsConfirmLoading(true);
      console.log(transactions)
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;
      // Here you will add the fetch to akunpajakdata
      // const akunHutang = await fetchAkunHutangPajak(selectedPajak?.pajakId || "", companyId, token)
      // setAkunHutang(akunHutang.akun_perkiraan_hutang_details[0].id);

      const akunLawanBeban = await fetchLawanTransaksiById(companyId, parseInt(selectedLawanTransaksi))
      setAkunLawanBeban(akunLawanBeban.akun_hutang.id);
      
      // After fetching akunpajakdata successfully
      handleViewModeSwitch();
    } catch (error) {
      console.error('Error during confirmation:', error);
      showAlert('Failed to process confirmation', 'error');
    } finally {
      setIsConfirmLoading(false);
    }
  };

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
      { field: "Jumlah" as const, label: "Debit", type: "text" as const },
      { field: "kredit" as const, label: "Kredit", type: "text" as const },
      { field: "keterangan" as const, label: "Keterangan", type: "text" as const },
    ],
    [viewMode, allAkunPerkiraanOptions]
  );

  // Dummy functions for disabled state
  const dummyChange = () => {};
  const dummyAddRow = () => {};
  const dummyDeleteRow = () => {};


  const getJurnalViewData = async () => {
    const smartTaxData = [];
    let entryNo = 1;
    const token = localStorage.getItem("token") || "";
    const companyId = localStorage.getItem("companyID") || "";

    // Process each transaction (smart-tax data)
    for (const transaction of transactions) {
      // Add akun perkiraan entry
      smartTaxData.push({
        no: entryNo.toString(),
        akunPerkiraan: transaction.akunPerkiraan,
        Jumlah: formatRupiah(transaction.jumlah),
        kredit: "0",
        keterangan: transaction.keterangan,
        isSmartTax: true // Mark as smart-tax generated
      });
      entryNo++;

      // If transaction has tax, add tax entry
      if (transaction.pajak && parseInt(transaction.dpp) != 0) {
        const akunHutangPajak = await fetchAkunHutangPajak(
          transaction.pajak.pajakId,
          companyId,
          token
        );
        smartTaxData.push({
          no: entryNo.toString(),
          akunPerkiraan: akunHutangPajak?.akun_perkiraan_hutang_details[0]?.id.toString() || "",
          Jumlah: "0",
          kredit: formatRupiah(transaction.pajak.nilai.toString()),
          keterangan: transaction.keterangan,
          isSmartTax: true // Mark as smart-tax generated
        });
        entryNo++;
      }
    }

    // Add lawan transaksi entry
    smartTaxData.push({
      no: entryNo.toString(),
      akunPerkiraan: akunLawanBeban?.toString() || "",
      Jumlah: "0",
      kredit: formatRupiah(totalSetelahPajak.toString()),
      keterangan: transactions[0]?.keterangan || "",
      isSmartTax: true // Mark as smart-tax generated
    });

    // Merge smart-tax data with existing manual rows
    const combinedData = [
      ...smartTaxData,
      ...manualRows.map((row, index) => ({
        ...row,
        no: (smartTaxData.length + index + 1).toString() // Renumber manual rows
      }))
    ];

    setJurnalData(combinedData);
    return combinedData;
  };

  // Update jurnal data when first entering jurnal mode or when akunLawanBeban changes
  React.useEffect(() => {
    if (viewMode === 'jurnal' && akunLawanBeban) {
      // Only regenerate smart-tax data, preserve manual data
      getJurnalViewData();
    }
  }, [akunLawanBeban, viewMode]); // Removed transactions dependency

  const handleLawanTransaksiChange = (value: string) => {
    setSelectedLawanTransaksi(value);
  };

  const handleTotalChange = React.useCallback((newTotalPajak: number, newTotalSetelahPajak: number, newTotalJumlah: number) => {
    setTotalPajak(newTotalPajak);
    setTotalSetelahPajak(newTotalSetelahPajak);
    setTotalJumlah(newTotalJumlah);
  }, []);

  // Handle transactions change
  const handleTransactionsChange = (newTransactions: TransactionData[]) => {
    setTransactions(newTransactions);
  };

  // Fungsi untuk TableInsertManual (mode jurnal)
  const handleManualRowChange = (index: number, field: keyof RowData, value: string) => {
    const newData = [...jurnalData];
    const rowToUpdate = newData[index];
    
    // Update the field
    if ((field === 'Jumlah' || field === 'kredit') && value.trim() === '') {
      (rowToUpdate[field] as any) = '0';
    } else {
      (rowToUpdate[field] as any) = value;
    }
    
    // If this is a manual row, update manualRows state
    if (!rowToUpdate.isSmartTax) {
      const smartTaxRows = jurnalData.filter(row => row.isSmartTax);
      const manualRowIndex = index - smartTaxRows.length;
      
      if (manualRowIndex >= 0 && manualRowIndex < manualRows.length) {
        const updatedManualRows = [...manualRows];
        const updatedRow = { ...updatedManualRows[manualRowIndex] };
        
        if ((field === 'Jumlah' || field === 'kredit') && value.trim() === '') {
          (updatedRow[field] as any) = '0';
        } else {
          (updatedRow[field] as any) = value;
        }
        
        updatedManualRows[manualRowIndex] = updatedRow;
        setManualRows(updatedManualRows);
      }
    }
    
    setJurnalData(newData);
  };

  // Hitung total debit dan kredit setiap jurnalData berubah
  React.useEffect(() => {
    if (viewMode === 'jurnal') {
      const totalDebit = jurnalData.reduce((sum, row) => sum + parseInputNumber(row.Jumlah), 0);
      const totalKredit = jurnalData.reduce((sum, row) => sum + parseInputNumber(row.kredit), 0);
      setTotalDebit(totalDebit);
      setTotalKredit(totalKredit);
    }
  }, [jurnalData, viewMode]);

  const handleAddManualRow = () => {
    const newManualRow = {
      no: (manualRows.length + 1).toString(),
      akunPerkiraan: '',
      Jumlah: '',
      kredit: '',
      keterangan: '',
      isSmartTax: false
    };
    
    const updatedManualRows = [...manualRows, newManualRow];
    setManualRows(updatedManualRows);
    
    // Update jurnalData by merging smart-tax data with updated manual rows
    const smartTaxRows = jurnalData.filter(row => row.isSmartTax);
    const combinedData = [
      ...smartTaxRows,
      ...updatedManualRows.map((row, index) => ({
        ...row,
        no: (smartTaxRows.length + index + 1).toString()
      }))
    ];
    setJurnalData(combinedData);
  };

  const handleDeleteManualRow = (index: number) => {
    const rowToDelete = jurnalData[index];
    if (!rowToDelete.isSmartTax) {
      // Find the index in manualRows
      const manualIndex = manualRows.findIndex(row => 
        row.akunPerkiraan === rowToDelete.akunPerkiraan && 
        row.Jumlah === rowToDelete.Jumlah &&
        row.kredit === rowToDelete.kredit &&
        row.keterangan === rowToDelete.keterangan
      );
      
      if (manualIndex !== -1) {
        const updatedManualRows = manualRows.filter((_, i) => i !== manualIndex);
        setManualRows(updatedManualRows);
        
        // Update jurnalData by merging smart-tax data with updated manual rows
        const smartTaxRows = jurnalData.filter(row => row.isSmartTax);
        const combinedData = [
          ...smartTaxRows,
          ...updatedManualRows.map((row, index) => ({
            ...row,
            no: (smartTaxRows.length + index + 1).toString()
          }))
        ];
        setJurnalData(combinedData);
      }
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
              <Typography className={styles.labelText}>Tanggal</Typography>
              <DatePickerField
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value as string)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nomor Transaksi</Typography>
              <FieldText
                label="Nomor Transaksi"
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
              transactions={transactions}
              onTransactionsChange={handleTransactionsChange}
            />
          ) : (
            <>
              <TableInsertManual
                rows={viewMode === 'jurnal' ? jurnalData : rows}
                columns={columns}
                onChange={handleManualRowChange}
                addRow={handleAddManualRow}
                deleteRow={handleDeleteManualRow}
                showAddButton={true}
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