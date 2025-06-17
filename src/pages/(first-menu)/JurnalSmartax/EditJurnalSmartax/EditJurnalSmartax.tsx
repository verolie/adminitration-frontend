import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControl, Select, MenuItem, InputLabel, TextField, CircularProgress } from "@mui/material";
import Button from "../../../../component/button/button";
import DatePickerField from "../../../../component/textField/dateAreaText";
import FieldText from "../../../../component/textField/fieldText";
import TableInsertManual from "../../../../component/tableInsertManual/tableInserManual";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import { createJurnalSmartax } from "../function/createJurnalSmartax";
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import type { AkunPerkiraanItem } from "../function/fetchAkunPerkiraanAll";
import { fetchAkunPerkiraanAll } from "../function/fetchAkunPerkiraanAll";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";
import { useAlert } from "../../../../context/AlertContext";
import { fetchAkunHutangPajak } from "../function/fetchAkunHutangPajak";
import { fetchLawanTransaksiById } from "../function/fetchLawanTransaksiById ";
import { formatRupiah, parseInputNumber } from "@/utils/formatNumber";
import { fetchSmartTaxID } from "../function/fetchSmartTaxID";
import { editJurnalSmartax } from "../function/editJurnalSmartax";

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

export default function EditJurnalSmartax({ id, onClose }: { id: string; onClose: () => void }) {
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
  const [originalJurnalData, setOriginalJurnalData] = React.useState<any[]>([]);
  const [manualRows, setManualRows] = React.useState<RowData[]>([]);

  const { showAlert } = useAlert();

  const handleRowChange = (index: number, field: keyof RowData, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    // Sync smart-tax changes to jurnalData
    const changedRow = newRows[index];
    const updatedJurnalData = [...jurnalData];
    const jurnalIndex = updatedJurnalData.findIndex(
      (row) => row.isSmartTax && row.akunPerkiraan === changedRow.akunPerkiraan
    );
    
    if (jurnalIndex !== -1) {
      updatedJurnalData[jurnalIndex] = {
        ...updatedJurnalData[jurnalIndex],
        [field]: value,
        Jumlah: field === 'Jumlah' ? value : updatedJurnalData[jurnalIndex].Jumlah,
        kredit: field === 'kredit' ? value : updatedJurnalData[jurnalIndex].kredit,
        keterangan: field === 'keterangan' ? value : updatedJurnalData[jurnalIndex].keterangan
      };
      setJurnalData(updatedJurnalData);
    }

    // Recalculate totals
    const totalDebit = newRows.reduce((sum, row) => sum + parseInputNumber(row.Jumlah), 0);
    const totalKredit = newRows.reduce((sum, row) => sum + parseInputNumber(row.kredit), 0);
    setTotalDebit(totalDebit);
    setTotalKredit(totalKredit);
  };

  const handlePajakChange = (pajak: PajakData | null) => {
    setSelectedPajak(pajak);
  };

  // Fetch lawan transaksi list (identik dengan Create)
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

  // Fetch akun perkiraan detail (identik dengan Create)
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
          showAlert("Gagal mengambil akun perkiraan", "error");
        }
      }
    };
    fetchAkunPerkiraan();
  }, [selectedLawanTransaksi, showAlert]);

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
        if (!token || !companyId || !id) return;
        const data = await fetchSmartTaxID(companyId, id, token);
        console.log("data", data)
        setFakturValue(data.faktur || "");
        setTanggalValue(data.tgl || "");
        setDeskripsiValue(data.deskripsi || "");
        setSelectedLawanTransaksi(data.id_lawan_transaksi?.toString() || "");
        
        // Hanya baris smartax (id_objek_pajak dan persentase_pajak tidak null)
        const smartaxRows = (data.JurnalDetails || []).filter(
          (detail: any) => detail.id_objek_pajak != null && detail.persentase_pajak != null
        );
        console.log("smartaxRows", smartaxRows)
        setRows(smartaxRows.map((detail: any) => ({
          no: "",
          akunPerkiraan: detail.id_akun_perkiraan_detail?.toString() || '',
          Jumlah: detail.debit > 0 ? formatRupiah(detail.debit) : "0",
          kredit: detail.kredit > 0 ? formatRupiah(detail.kredit) : "0",
          keterangan: detail.keterangan || "",
          isSmartTax: true
        })));
        setTransactions(smartaxRows.map((detail: any) => ({
          akunPerkiraan: detail.id_akun_perkiraan_detail?.toString() || '',
          dpp: detail.dpp ? formatRupiah(detail.dpp) : '0',
          pajak: detail.id_objek_pajak ? {
            pajakId: detail.id_objek_pajak.toString(),
            nama: detail.nama_objek_pajak || '',
            persentase: detail.persentase_pajak || 0,
            nilai: parseInputNumber(detail.jumlah_pajak) || 0
          } : null,
          jumlah: detail.debit > 0 ? formatRupiah(detail.debit) : "0",
          keterangan: detail.keterangan || "",
          isSmartTax: true
        })));
        setDppValues(smartaxRows.reduce((acc: Record<number, string>, detail: any, idx: number) => ({
          ...acc,
          [idx]: detail.dpp ? formatRupiah(detail.dpp) : '0'
        }), {}));
        setPajakRows(smartaxRows.reduce((acc: Record<number, PajakRowData[]>, detail: any, idx: number) => ({
          ...acc,
          [idx]: detail.id_objek_pajak ? [{
            pajakId: detail.id_objek_pajak.toString(),
            dpp: detail.dpp ? formatRupiah(detail.dpp) : '0',
            persentase: detail.persentase_pajak?.toString() || ''
          }] : []
        }), {}));
        setSelectedAkunPerkiraan(
          smartaxRows.reduce((acc: Record<number, string>, detail: any, idx: number) => ({
            ...acc,
            [idx]: detail.id_akun_perkiraan_detail?.toString() || ''
          }), {})
        );
        
        // Initialize jurnalData with ALL journal details for manual view
        const allJurnalDetails = (data.JurnalDetails || []).map((detail: any, index: number) => {
          const smartTaxTransactionCount = smartaxRows.length;
          const estimatedSmartTaxEntries = smartTaxTransactionCount * 2 + 1;
          const isSmartTaxRelated = index < estimatedSmartTaxEntries;
          
          return {
            no: (index + 1).toString(),
            akunPerkiraan: detail.id_akun_perkiraan_detail?.toString() || '',
            Jumlah: detail.debit > 0 ? formatRupiah(detail.debit) : "0",
            kredit: detail.kredit > 0 ? formatRupiah(detail.kredit) : "0",
            keterangan: detail.keterangan || "",
            isSmartTax: isSmartTaxRelated
          };
        });
        
        // Separate smart-tax data and manual data
        const smartTaxData = allJurnalDetails.filter((row: RowData) => row.isSmartTax);
        const manualData = allJurnalDetails.filter((row: RowData) => !row.isSmartTax);
        
        setJurnalData(allJurnalDetails);
        setManualRows(manualData); 
        setOriginalJurnalData(data.JurnalDetails || []);
        
        setTotalPajak(data.jumlah_pajak || 0);
        setTotalDebit(data.total_debit || 0);
        setTotalKredit(data.total_kredit || 0);
      } catch (error) {
        console.error("ERROR FETCH JURNAL SMARTAX:", error);
        showAlert("Gagal mengambil data jurnal", "error");
      }
    };
    fetchData();
  }, [id, showAlert]);

  // Fungsi untuk TableInsertManual (mode jurnal)
  const handleManualRowChange = (index: number, field: keyof RowData, value: string) => {
    const newData = [...jurnalData];
    const rowToUpdate = newData[index];

    if ((field === 'Jumlah' || field === 'kredit') && value.trim() === '') {
      (rowToUpdate[field] as any) = '0';
    } else {
      (rowToUpdate[field] as any) = value;
    }
    
    // If this is a manual row, update manualRows state
    if (!rowToUpdate.isSmartTax) {
      const smartTaxRows = jurnalData.filter((row: RowData) => row.isSmartTax);
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
    
    // Sync manual changes back to smart-tax data if it's a smart-tax row
    const changedRow = newData[index];
    if (changedRow.isSmartTax) {
      // Update rows (for TableInsertSmartTax)
      const updatedRows = [...rows];
      const rowIndex = updatedRows.findIndex((row: RowData) => row.akunPerkiraan === changedRow.akunPerkiraan);
      if (rowIndex !== -1) {
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [field]: value,
          Jumlah: field === 'Jumlah' ? value : updatedRows[rowIndex].Jumlah,
          kredit: field === 'kredit' ? value : updatedRows[rowIndex].kredit,
          keterangan: field === 'keterangan' ? value : updatedRows[rowIndex].keterangan
        };
        setRows(updatedRows);
      }
      
      // Update transactions (for TableInsertSmartTax)
      const updatedTransactions = [...transactions];
      const transactionIndex = updatedTransactions.findIndex((t: TransactionData) => t.akunPerkiraan === changedRow.akunPerkiraan);
      if (transactionIndex !== -1) {
        updatedTransactions[transactionIndex] = {
          ...updatedTransactions[transactionIndex],
          jumlah: field === 'Jumlah' ? value : updatedTransactions[transactionIndex].jumlah,
          keterangan: field === 'keterangan' ? value : updatedTransactions[transactionIndex].keterangan
        };
        setTransactions(updatedTransactions);
      }
    }
  };

  const handleAddManualRow = () => {
    const newManualRow = {
      no: (manualRows.length + 1).toString(),
      akunPerkiraan: '',
      Jumlah: '0',
      kredit: '0',
      keterangan: '',
      isSmartTax: false
    };
    
    const updatedManualRows = [...manualRows, newManualRow];
    setManualRows(updatedManualRows);
    
    // Update jurnalData by merging smart-tax data with updated manual rows
    const smartTaxRows = jurnalData.filter((row: RowData) => row.isSmartTax);
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
      const manualIndex = manualRows.findIndex((row: RowData) => 
        row.akunPerkiraan === rowToDelete.akunPerkiraan && 
        row.Jumlah === rowToDelete.Jumlah &&
        row.kredit === rowToDelete.kredit &&
        row.keterangan === rowToDelete.keterangan
      );
      
      if (manualIndex !== -1) {
        const updatedManualRows = manualRows.filter((_, i) => i !== manualIndex);
        setManualRows(updatedManualRows);
        
        // Update jurnalData by merging smart-tax data with updated manual rows
        const smartTaxRows = jurnalData.filter((row: RowData) => row.isSmartTax);
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

  // Hitung total debit dan kredit setiap jurnalData berubah
  React.useEffect(() => {
    if (viewMode === 'jurnal') {
      const totalDebit = jurnalData.reduce((sum, row) => sum + parseInputNumber(row.Jumlah), 0);
      const totalKredit = jurnalData.reduce((sum, row) => sum + parseInputNumber(row.kredit), 0);
      setTotalDebit(totalDebit);
      setTotalKredit(totalKredit);
    }
  }, [jurnalData, viewMode]);

  // Validasi field penting sebelum submit
  const validateManualRows = (rows: RowData[]) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.akunPerkiraan) {
        showAlert(`Pilih Akun Perkiraan untuk baris ${i + 1}!`, "error");
        return false;
      }
      const jumlahValue = parseInputNumber(row.Jumlah);
      const kreditValue = parseInputNumber(row.kredit);
      if (jumlahValue < 0 || kreditValue < 0) {
        showAlert(`Nilai debit/kredit tidak boleh negatif di baris ${i + 1}!`, "error");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    if (totalDebit !== totalKredit) {
      showAlert("Total debit dan kredit harus seimbang.", "error");
      return;
    }

    // Validasi baris sebelum submit
    const validRows = (viewMode === 'jurnal' ? jurnalData : rows).filter(row => row.akunPerkiraan && row.akunPerkiraan !== '');
    if (validRows.length === 0) {
      showAlert("Tidak ada baris jurnal yang valid.", "error");
      return;
    }
    if (viewMode === 'jurnal' && !validateManualRows(validRows)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (token) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('faktur', fakturValue);
        formData.append('tgl', tanggalValue);
        formData.append('total_debit', totalDebit.toString());
        formData.append('total_kredit', totalKredit.toString());
        formData.append('lawan_transaksi_id', selectedLawanTransaksi);
        formData.append('is_smart_tax', 'true');
        formData.append('jurnal_detail', JSON.stringify(
          validRows.map((row, index) => {
            // For jurnal mode, we need to find the corresponding transaction data
            // based on the row's isSmartTax flag and account
            let transaction = null;
            let originalData = null;
            
            if (viewMode === 'jurnal') {
              if (row.isSmartTax) {
                // Find matching transaction by account ID for smart tax rows
                transaction = transactions.find(t => t.akunPerkiraan === row.akunPerkiraan);
              } else {
                // For non-smart-tax rows, preserve original data
                originalData = originalJurnalData.find(orig => 
                  orig.id_akun_perkiraan_detail?.toString() === row.akunPerkiraan
                );
              }
            } else if (viewMode === 'smart-tax') {
              transaction = transactions[index] || {};
            }
            
            // If it's a non-smart-tax row in jurnal mode, preserve original tax data
            if (viewMode === 'jurnal' && !row.isSmartTax && originalData) {
              return {
                akun_perkiraan_detail_id: row.akunPerkiraan,
                debit: parseInputNumber(row.Jumlah) || 0,
                kredit: parseInputNumber(row.kredit) || 0,
                urut: index + 1,
                keterangan: row.keterangan,
                // Preserve original tax data for non-smart-tax rows
                dpp: originalData.dpp,
                persentase_pajak: originalData.persentase_pajak,
                jumlah_pajak: originalData.jumlah_pajak,
                objek_pajak_id: originalData.id_objek_pajak
              };
            }
            
            // For smart-tax rows or smart-tax mode, use transaction data
            return {
              akun_perkiraan_detail_id: row.akunPerkiraan,
              debit: parseInputNumber(row.Jumlah) || 0,
              kredit: parseInputNumber(row.kredit) || 0,
              urut: index + 1,
              keterangan: row.keterangan,
              dpp: transaction?.dpp ? parseInputNumber(transaction.dpp) : null,
              persentase_pajak: transaction?.pajak?.persentase ?? null,
              jumlah_pajak: transaction?.pajak?.nilai ?? null,
              objek_pajak_id: transaction?.pajak?.pajakId ?? null
            };
          })
        ));
        formData.append('deskripsi', deskripsiValue || '');
        if (fileUpload) {
          formData.append('file', fileUpload);
        }
        formData.append('company_id', companyId || '');
        if (selectedPajak?.pajakId) formData.append('objek_pajak_id', selectedPajak.pajakId);
        if (totalPajak) formData.append('jumlah_pajak', totalPajak.toString());
        if (selectedPajak?.persentase) formData.append('persentase_pajak', selectedPajak.persentase.toString());
        if (transactions[0]?.dpp) formData.append('dpp', parseInputNumber(transactions[0].dpp).toString());
        const result = await editJurnalSmartax(formData, token);
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

  const handleViewModeSwitch = () => {
    if (viewMode === 'smart-tax') {
      // Untuk mode smart-tax, validasi bisa dilakukan jika perlu
      // (atau skip jika tidak ada validasi khusus)
    } else {
      // Untuk mode jurnal, validasi manual rows
      if (!validateManualRows(jurnalData)) {
        return;
      }
    }

    setViewMode(viewMode === 'smart-tax' ? 'jurnal' : 'smart-tax');
  };

  const handleConfirm = async () => {
    try {
      setIsConfirmLoading(true);
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;
      
      // Ambil akun lawan beban
      const akunLawanBeban = await fetchLawanTransaksiById(companyId, parseInt(selectedLawanTransaksi));
      setAkunLawanBeban(akunLawanBeban.akun_hutang.id);
      setViewMode('jurnal');
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

  React.useEffect(() => {
  }, [akunLawanBeban, viewMode]);

  const handleLawanTransaksiChange = (value: string) => {
    setSelectedLawanTransaksi(value);
  };

  const handleTotalChange = React.useCallback((newTotalPajak: number, newTotalSetelahPajak: number, newTotalJumlah: number) => {
    setTotalPajak(newTotalPajak);
    setTotalSetelahPajak(newTotalSetelahPajak);
    setTotalJumlah(newTotalJumlah);
  }, []);

  // Handle transactions change and sync with jurnalData
  const handleTransactionsChange = (newTransactions: TransactionData[]) => {
    setTransactions(newTransactions);
    
    // Sync smart-tax changes to jurnalData
    const updatedJurnalData = [...jurnalData];
    
    newTransactions.forEach((transaction, transactionIndex) => {
      // Find corresponding smart-tax row in jurnalData
      const jurnalIndex = updatedJurnalData.findIndex(
        (row: RowData) => row.isSmartTax && row.akunPerkiraan === transaction.akunPerkiraan
      );
      
      if (jurnalIndex !== -1) {
        // Update existing smart-tax row in jurnalData
        updatedJurnalData[jurnalIndex] = {
          ...updatedJurnalData[jurnalIndex],
          Jumlah: transaction.jumlah,
          keterangan: transaction.keterangan
        };
      }
    });
    
    // Merge updated smart-tax data with manual rows
    const smartTaxRows = updatedJurnalData.filter((row: RowData) => row.isSmartTax);
    const combinedData = [
      ...smartTaxRows,
      ...manualRows.map((row, index) => ({
        ...row,
        no: (smartTaxRows.length + index + 1).toString()
      }))
    ];
    
    setJurnalData(combinedData);
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