import React, { useState } from "react";
import { TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styles.module.css";
import { fetchAkunPerkiraanDetail } from "./fetchAkunPerkiraanDetail";
import Button from "../../../../component/button/button";
import AkunPerkiraan from "../../AkunPerkiraan/AkunPerkiraan";
import FieldText from "../../../../component/textField/fieldText";
import { useAppContext } from "@/context/context";
import { useAlert } from "../../../../context/AlertContext";
import { CircularProgress } from "@mui/material";
import { formatRupiah, parseInputNumber, formatRupiahInput } from "@/utils/formatNumber";

interface LawanTransaksi {
  id: number;
  nama: string;
  npwp: string;
  nik: string | null;
  nitku: string | null;
  alamat: string;
  is_badan_usaha: boolean;
}

type RowData = {
  no: string;
  akunPerkiraan: string;
  Jumlah: string;
  kredit: string;
  keterangan: string;
};

interface AkunPerkiraan {
  id: string;
  nama: string;
  pajak?: PajakTerkait[];
}
interface PajakTerkait {
  id: string;
  nama: string;
  persentase: number;
  is_badan_usaha: boolean;
  deskripsi?: string;
}
interface PajakRowData {
  pajakId: string;
  dpp: string;
  persentase: string;
}

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

interface TableInsertSmartTaxProps {
  rows: {
    no: string;
    akunPerkiraan: string;
    Jumlah: string;
    kredit: string;
    keterangan: string;
  }[];
  lawanTransaksiList: LawanTransaksi[];
  selectedLawanTransaksi: string;
  onLawanTransaksiChange: (value: string) => void;
  onChange: (index: number, field: keyof RowData, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
  onPajakChange: (pajak: { pajakId: string; nama: string; persentase: number; } | null) => void;
  onConfirm: () => void;
  selectedAkunPerkiraan: { [key: number]: string };
  onAkunPerkiraanChange: (rowIndex: number, akunId: string) => void;
  dppValues: { [key: number]: string };
  onDppChange: (rowIndex: number, value: string) => void;
  pajakRows: { [key: number]: PajakRowData[] };
  onPajakRowsChange: (rows: { [key: number]: PajakRowData[] }) => void;
  selectedPajak: { pajakId: string; nama: string; persentase: number; } | null;
  totalPajak: number;
  totalSetelahPajak: number;
  totalJumlah: number;
  onTotalChange: (totalPajak: number, totalSetelahPajak: number, totalJumlah: number) => void;
  transactions: TransactionData[];
  onTransactionsChange: (transactions: TransactionData[]) => void;
}

const TableInsertSmartTax: React.FC<TableInsertSmartTaxProps> = ({
  rows,
  lawanTransaksiList,
  selectedLawanTransaksi,
  onLawanTransaksiChange,
  onChange,
  addRow,
  deleteRow,
  onPajakChange,
  onConfirm,
  selectedAkunPerkiraan,
  onAkunPerkiraanChange,
  dppValues,
  onDppChange,
  pajakRows,
  onPajakRowsChange,
  selectedPajak,
  totalPajak,
  totalSetelahPajak,
  totalJumlah,
  onTotalChange,
  transactions,
  onTransactionsChange,
}) => {
  const { showAlert } = useAlert();
  const { addTab } = useAppContext();
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<{ [row: number]: AkunPerkiraan[] }>({});
  const [loadingAkun, setLoadingAkun] = React.useState<{ [row: number]: boolean }>({});

  // Calculate tax values for a transaction
  const calculateTaxValues = (dpp: string, persentase: number) => {
    const dppValue = parseInputNumber(dpp);
    const pajakValue = dppValue * (persentase / 100);
    const sisaDpp = dppValue - pajakValue;
    return {
      pajakValue,
      sisaDpp
    };
  };

  // Handle transaction changes
  const handleTransactionChange = (index: number, field: keyof TransactionData, value: string) => {
    const newTransactions = [...transactions];
    const transaction = newTransactions[index];
    
    // Update the field
    if (field === 'pajak') {
      // Handle pajak separately since it's an object
      return;
    }
    (transaction[field] as any) = value;

    // If jumlah is changed, update DPP and recalculate tax
    if (field === 'jumlah') {
      transaction.dpp = formatRupiah(value);
      if (transaction.pajak) {
        const { pajakValue } = calculateTaxValues(value, transaction.pajak.persentase);
        transaction.pajak.nilai = pajakValue;
      }
    }

    // If DPP is changed, recalculate tax values
    if (field === 'dpp' && transaction.pajak) {
      const { pajakValue } = calculateTaxValues(value, transaction.pajak.persentase);
      console.log("NILAI PAJAK = " + pajakValue)
      transaction.pajak.nilai = pajakValue;
    }

    onTransactionsChange(newTransactions);
  };

  // Handle tax selection for a transaction
  const handleTransactionPajakChange = (index: number, pajak: PajakTerkait | null) => {
    const newTransactions = [...transactions];
    const transaction = newTransactions[index];
    
    if (pajak) {
      const { pajakValue } = calculateTaxValues(transaction.dpp, pajak.persentase);
      transaction.pajak = {
        pajakId: pajak.id,
        nama: pajak.nama,
        persentase: pajak.persentase,
        nilai: pajakValue
      };
      transaction.isSmartTax = true;
    } else {
      transaction.pajak = null;
      transaction.isSmartTax = false;
    }

    onTransactionsChange(newTransactions);
  };

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    const newTransaction: TransactionData = {
      akunPerkiraan: '',
      dpp: '0',
      pajak: null,
      jumlah: '0',
      keterangan: '',
      isSmartTax: false
    };
    onTransactionsChange([...transactions, newTransaction]);

    // Fetch akun perkiraan options for the new row
    const newIndex = transactions.length;
    setLoadingAkun((prev) => ({ ...prev, [newIndex]: true }));
    const token = localStorage.getItem("token") || "";
    const companyId = localStorage.getItem("companyID") || "";
    fetchAkunPerkiraanDetail({ companyId }, token)
      .then((data) => {
        const mapped = mapAkunPerkiraan(data);
        setAkunPerkiraanOptions((prev) => ({ ...prev, [newIndex]: mapped }));
        setLoadingAkun((prev) => ({ ...prev, [newIndex]: false }));
      })
      .catch(() => setLoadingAkun((prev) => ({ ...prev, [newIndex]: false })));
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (index: number) => {
    onTransactionsChange(transactions.filter((_, i) => i !== index));
  };

  // Calculate totals whenever transactions change
  React.useEffect(() => {
    let newTotalJumlah = 0;
    let newTotalPajak = 0;

    transactions.forEach(transaction => {
      const jumlahValue = parseInputNumber(transaction.jumlah);
      newTotalJumlah += jumlahValue;
      
      if (transaction.pajak) {
        const { pajakValue } = calculateTaxValues(transaction.dpp, transaction.pajak.persentase);
        newTotalPajak += pajakValue;
      }
    });

    const newTotalSetelahPajak = newTotalJumlah - newTotalPajak;
    onTotalChange(newTotalPajak, newTotalSetelahPajak, newTotalJumlah);
  }, [transactions, onTotalChange]);

  // Initialize akun perkiraan options when lawan transaksi is selected
  React.useEffect(() => {
    if (selectedLawanTransaksi) {
      const token = localStorage.getItem("token") || "";
      const companyId = localStorage.getItem("companyID") || "";
      
      // Fetch akun perkiraan options for all rows
      transactions.forEach((_, index) => {
        if (!akunPerkiraanOptions[index] && !loadingAkun[index]) {
          setLoadingAkun((prev) => ({ ...prev, [index]: true }));
          fetchAkunPerkiraanDetail({ companyId }, token)
            .then((data) => {
              const mapped = mapAkunPerkiraan(data);
              setAkunPerkiraanOptions((prev) => ({ ...prev, [index]: mapped }));
              setLoadingAkun((prev) => ({ ...prev, [index]: false }));
            })
            .catch(() => setLoadingAkun((prev) => ({ ...prev, [index]: false })));
        }
      });
    }
  }, [selectedLawanTransaksi, transactions]);

  // Auto-select tax when available
  React.useEffect(() => {
    if (selectedLawanTransaksi && selectedAkunPerkiraan[0]) {
      const lawan = lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi));
      const isBadanUsaha = lawan?.is_badan_usaha;
      const akun = akunPerkiraanOptions[0]?.find(a => a.id === selectedAkunPerkiraan[0]);
      const pajakList = akun?.pajak?.filter(p => p.is_badan_usaha === isBadanUsaha) || [];
      const currentDppValue = formatRupiah(rows[0]?.Jumlah || '0');
    const rowPajak = pajakRows[0]?.[0];

      if (pajakList.length > 0 && !rowPajak) {
        const selectedPajakItem = pajakList[0];
        onPajakChange({
          pajakId: selectedPajakItem.id,
          nama: selectedPajakItem.nama,
          persentase: selectedPajakItem.persentase
        });

        const updatedPajakRows = {
          0: [{
            pajakId: selectedPajakItem.id,
            dpp: currentDppValue,
            persentase: String(selectedPajakItem.persentase)
          }]
        };
        onPajakRowsChange(updatedPajakRows);
      }
    }
  }, [selectedLawanTransaksi, selectedAkunPerkiraan, akunPerkiraanOptions, lawanTransaksiList, pajakRows, rows]);

  function mapAkunPerkiraan(api: any[]): AkunPerkiraan[] {
    return api.map((a) => ({
      id: a.id,
      nama: `${a.kode_akun} - ${a.nama_akun}`,
      pajak: (a.objek_pajak_details || []).map((obj: any) => {
        // Get the latest persentase if available
        const latestPersentase = obj.ObjekPajakDetails?.length > 0 
          ? obj.ObjekPajakDetails.sort((a: any, b: any) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime())[0].persentase 
          : 0;

        return {
          id: obj.id,
          kode_objek: obj.kode_objek,
          nama: obj.nama_objek,
          persentase: latestPersentase,
          is_badan_usaha: obj.akun_objek_pajak?.is_badan_usaha,
          deskripsi: obj.deskripsi_objek
        };
      }).filter((pajak: PajakTerkait) => pajak.persentase > 0) // Only include taxes with valid persentase
    }));
  }

  function getLatestPersentase(details: any[]) {
    if (!details || details.length === 0) return 0;
    const today = new Date();
    // Filter yang <= hari ini, lalu ambil yang paling baru
    const valid = details.filter((d) => new Date(d.tgl) <= today);
    const sorted = (valid.length ? valid : details).sort((a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime());
    return sorted[0]?.persentase ?? 0;
  }

  // Handler untuk pilih akun perkiraan
  const handleAkunPerkiraanChange = (rowIdx: number, akunId: string) => {
    onAkunPerkiraanChange(rowIdx, akunId);
    
    // Clear existing pajak rows for this row
    const updatedPajakRows = {
      ...pajakRows,
      [rowIdx]: []
    };
    onPajakRowsChange(updatedPajakRows);
    
    // Call the parent's handler to update shared state
    if (rowIdx === 0) {
      onPajakChange(null);
    }
  };

  // Handler untuk hapus pajak
  const handleDeletePajak = (rowIdx: number, pajakIdx: number) => {
    const newPajakRows = {
      ...pajakRows,
      [rowIdx]: pajakRows[rowIdx].filter((_: PajakRowData, i: number) => i !== pajakIdx),
    };
    onPajakRowsChange(newPajakRows);
  };

  // Handler for Lawan Transaksi
  const handleAddLawanTransaksi = () => {
    addTab("Lawan Transaksi");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("switchLawanTransaksiTab", { detail: "Create Lawan Transaksi" }));
    }, 1000);
  };

  // Handler for Akun Perkiraan
  const handleBuatBaruAkun = () => {
    addTab("Akun Perkiraan");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("switchAkunPerkiraanTab", { detail: "Create Akun Perkiraan" }));
    }, 1000);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Lawan Transaksi</th>
            <th style={{ width: "15%" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedLawanTransaksi}
                  onChange={(e) => onLawanTransaksiChange(e.target.value)}
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
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <Button label="+ lawan transaksi" onClick={handleAddLawanTransaksi} />
            </td>
          </tr>
          
          {/* Lawan Transaksi Details */}
          {selectedLawanTransaksi && (
          <tr>
            <td colSpan={2}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "8px 0" }}>
                <TextField
                  label="NPWP"
                  value={lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi))?.npwp || ""}
                  size="small"
                  fullWidth
                  disabled
                />
                <TextField
                  label="NIK"
                  value={lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi))?.nik || ""}
                  size="small"
                  fullWidth
                  disabled
                />
                <TextField
                  label="NITKU"
                  value={lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi))?.nitku || ""}
                  size="small"
                  fullWidth
                  disabled
                />
              </div>
            </td>
          </tr>
          )}

          {/* Transactions */}
          {selectedLawanTransaksi && transactions.map((transaction, index) => (
            <React.Fragment key={index}>
              <tr>
                <td colSpan={2}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 0" }}>
                    {/* Akun Perkiraan Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Akun Perkiraan</InputLabel>
                        <Select
                          value={transaction.akunPerkiraan}
                          label="Akun Perkiraan"
                          onChange={(e) => handleTransactionChange(index, 'akunPerkiraan', e.target.value)}
                        >
                          <MenuItem value="" disabled>Pilih Akun Perkiraan</MenuItem>
                          {akunPerkiraanOptions[index]?.map((akun) => (
                            <MenuItem key={akun.id} value={akun.id}>{akun.nama}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button label="+" onClick={handleBuatBaruAkun} />
                      {index > 0 && (
                        <IconButton onClick={() => handleDeleteTransaction(index)}>
                          <Delete />
                        </IconButton>
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      <TextField
                        label="Jumlah"
                        value={transaction.jumlah}
                        onChange={(e) => handleTransactionChange(index, 'jumlah', formatRupiahInput(e.target.value))}
                        onBlur={(e) => handleTransactionChange(index, 'jumlah', formatRupiah(e.target.value))}
                        size="small"
                        fullWidth
                        required
                      />
                      <TextField
                        label="Keterangan"
                        value={transaction.keterangan}
                        onChange={(e) => handleTransactionChange(index, 'keterangan', e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="DPP"
                        value={transaction.dpp}
                        onChange={(e) => handleTransactionChange(index, 'dpp', e.target.value)}
                        onBlur={(e) => handleTransactionChange(index, 'dpp', formatRupiah(e.target.value))}
                        size="small"
                        fullWidth
                      />
                    </div>

                    {/* Tax Section */}
                    {(() => {
                      const lawan = lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi));
                      const isBadanUsaha = lawan?.is_badan_usaha;
                      const akun = akunPerkiraanOptions[index]?.find(a => a.id === transaction.akunPerkiraan);
                      const pajakList = akun?.pajak?.filter(p => p.is_badan_usaha === isBadanUsaha) || [];

                      if (!akun || pajakList.length === 0) return null;

                      const selectedPajak = pajakList[0];
                      const { pajakValue, sisaDpp } = calculateTaxValues(transaction.dpp, selectedPajak.persentase);

                      // Update transaction's tax values
                      if (!transaction.pajak) {
                        handleTransactionPajakChange(index, selectedPajak);
                      }

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <TextField
                                label="Pajak"
                              value={`${selectedPajak.nama} (${selectedPajak.persentase}%)`}
                              size="small"
                              sx={{ minWidth: 200 }}
                              InputProps={{
                                readOnly: true
                              }}
                                />
                                <TextField
                                  label="Persentase"
                              value={selectedPajak.persentase.toString()}
                                  size="small"
                                  sx={{ width: 120 }}
                                  InputProps={{ endAdornment: <span>%</span> }}
                                  disabled={true}
                                />
                          </div>

                          {/* Tax Summary */}
                            <div style={{ 
                              background: "#e3f2fd", 
                              padding: "12px 16px", 
                              borderRadius: "4px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 8
                            }}>
                                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Pajak yang harus dibayar</div>
                                        <FieldText
                                          label="Pajak yang harus dibayar"
                                          value={formatRupiah(pajakValue)}
                                          disabled
                                          sx={{ width: "100%" }}
                                        />
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Non objek pajak</div>
                                        <FieldText
                                          label="Non objek pajak"
                                  value={formatRupiah(sisaDpp)}
                                          disabled
                                          sx={{ width: "100%" }}
                                        />
                                      </div>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>
                                      DPP sudah termasuk pajak
                                    </div>
                            </div>
                        </div>
                      );
                    })()}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
          
          {/* Add Transaction Button */}
          {selectedLawanTransaksi && (
            <tr>
              <td colSpan={2}>
                <Button label="+ Tambah Transaksi" onClick={handleAddTransaction} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ 
        marginTop: "10px", 
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "8px 16px",
          background: "#ffffff",
          borderRadius: "4px",
          border: "1px solid #e0e0e0"
        }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>Total Pajak</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total Jumlah</div>
              <FieldText
                label="Total Jumlah"
                value={formatRupiah(totalJumlah)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total Pajak yang harus dibayar</div>
              <FieldText
                label="Total Pajak yang harus dibayar"
                value={formatRupiah(totalPajak)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total harga setelah pajak</div>
              <FieldText
                label="Total harga setelah pajak"
                value={formatRupiah(totalSetelahPajak)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px'
      }}>
        <Button
          size="large"
          variant="confirm"
          label="Confirm"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

export default TableInsertSmartTax;
