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

interface LawanTransaksi {
  id: number;
  nama: string;
  npwp: string;
  nik: string | null;
  nitku: string | null;
  alamat: string;
  is_badan_usaha: boolean;
}

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

interface TableInsertSmartTaxProps {
  rows: {
    no: string;
    akunPerkiraan: string;
    bukti: string;
    Jumlah: string;
    kredit: string;
    keterangan: string;
  }[];
  lawanTransaksiList: LawanTransaksi[];
  selectedLawanTransaksi: string;
  onLawanTransaksiChange: (value: string) => void;
  onChange: (index: number, field: string, value: string) => void;
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
}

function formatRupiah(value: number | string) {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "Rp 0";
  return "Rp " + number.toLocaleString("id-ID");
}

function formatNumber(value: string) {
  // Remove all non-digit characters
  const number = value.replace(/\D/g, "");
  // Format with thousand separators
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseNumber(value: string): number {
  // Remove all non-digit characters and convert to integer
  return parseInt(value.replace(/\D/g, "")) || 0;
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
}) => {
  const { showAlert } = useAlert();
  const { addTab } = useAppContext();
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<{ [row: number]: AkunPerkiraan[] }>({});
  const [loadingAkun, setLoadingAkun] = React.useState<{ [row: number]: boolean }>({});
  const [localPajakRows, setLocalPajakRows] = useState<{ [key: number]: PajakRowData[] }>(pajakRows);

  // Add calculation utility function
  const calculatePajakValues = (dppValue: string, persentaseValue: string) => {
    const dppNum = parseNumber(dppValue);
    const persenNum = parseFloat(persentaseValue);
    const pajakValueRaw = (dppNum - (dppNum / (1 + (persenNum / 100))));
    const totalSetelahPajakRaw = dppNum - pajakValueRaw;

    const pajakValue = Math.round(pajakValueRaw * 100) / 100;
    const totalSetelahPajak = Math.round(totalSetelahPajakRaw * 100) / 100;

    return { pajakValue, totalSetelahPajak };
  };

  // Unified DPP change handler
  const handleDppChange = (rowIndex: number, value: string) => {
    const formattedValue = formatNumber(value);
    
    // Update parent DPP state
    onDppChange(rowIndex, formattedValue);

    // Update pajakRows with new DPP value
    if (pajakRows[rowIndex]?.[0]) {
      const newPajakRows = {
        ...pajakRows,
        [rowIndex]: [{
          ...pajakRows[rowIndex][0],
          dpp: formattedValue
        }]
      };
      setLocalPajakRows(newPajakRows);
      onPajakRowsChange(newPajakRows);
    }
  };

  // Calculate totals using the utility function
  React.useEffect(() => {
    const jumlahValue = parseInt((rows[0]?.Jumlah || '0').replace(/\D/g, "")) || 0;
    let finalTotalPajak = 0;

    const rowPajak = pajakRows[0]?.[0];
    if (rowPajak) {
      const calculated = calculatePajakValues(
        rowPajak.dpp || rows[0]?.Jumlah || '0',
        rowPajak.persentase
      );
      finalTotalPajak = calculated.pajakValue;
    }

    const finalTotalSetelahPajak = jumlahValue - finalTotalPajak;
    onTotalChange(finalTotalPajak, finalTotalSetelahPajak, jumlahValue);
  }, [rows, pajakRows, onTotalChange]);

  function mapAkunPerkiraan(api: any[]): AkunPerkiraan[] {
    console.log("akunPerkiraanOptions", JSON.stringify(api));
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
  
  
  // Fetch akun perkiraan saat lawan transaksi dipilih
  React.useEffect(() => {
    if (selectedLawanTransaksi && !akunPerkiraanOptions[0] && !loadingAkun[0]) {
      setLoadingAkun((prev) => ({ ...prev, [0]: true }));
      const token = localStorage.getItem("token") || "";
      const companyId = localStorage.getItem("companyID") || "";
      fetchAkunPerkiraanDetail({ companyId }, token)
        .then((data) => {
          // data.data dari API
          const mapped = mapAkunPerkiraan(data);
          setAkunPerkiraanOptions((prev) => ({ ...prev, [0]: mapped }));
          console.log("akunPerkiraanOptions", akunPerkiraanOptions);
          setLoadingAkun((prev) => ({ ...prev, [0]: false }));
        })
        .catch(() => setLoadingAkun((prev) => ({ ...prev, [0]: false })));
    }
  }, [selectedLawanTransaksi]);

  // Handler untuk pilih akun perkiraan
  const handleAkunPerkiraanChange = (rowIdx: number, akunId: string) => {
    onAkunPerkiraanChange(rowIdx, akunId);
    
    // Clear existing pajak rows for this row
    const updatedPajakRows = {
      ...pajakRows,
      [rowIdx]: []
    };
    setLocalPajakRows(updatedPajakRows);
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
    setLocalPajakRows(newPajakRows);
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
          {/* Additional Lawan Transaksi Details */}
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
          {/* Collapse Row */}
          {selectedLawanTransaksi && akunPerkiraanOptions[0] && (
            <tr className={styles.collapseRow}>
              <td colSpan={7} style={{ background: "#f5faff", padding: 0 }}>
                <div className={styles.collapseContent}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
                    {/* Akun Perkiraan Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Akun Perkiraan</InputLabel>
                        <Select
                          value={selectedAkunPerkiraan[0] || ""}
                          label="Akun Perkiraan"
                          onChange={(e) => handleAkunPerkiraanChange(0, e.target.value)}
                        >
                          <MenuItem value="" disabled>Pilih Akun Perkiraan</MenuItem>
                          {akunPerkiraanOptions[0].map((akun) => (
                            <MenuItem key={akun.id} value={akun.id}>{akun.nama}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button label="+" onClick={handleBuatBaruAkun} />
                    </div>

                    {/* Bukti, Jumlah, Keterangan Section */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                      <TextField
                        label="Jumlah "
                        value={rows[0].Jumlah}
                        onChange={(e) => onChange(0, "Jumlah", formatNumber(e.target.value))}
                        size="small"
                        fullWidth
                        required
                      />
                      <TextField
                        label="Bukti"
                        value={rows[0].bukti}
                        onChange={(e) => onChange(0, "bukti", e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Keterangan"
                        value={rows[0].keterangan}
                        onChange={(e) => onChange(0, "keterangan", e.target.value)}
                        size="small"
                        fullWidth
                      />
                    </div>

                    {/* Pajak Section */}
                    {(() => {
                      const lawan = lawanTransaksiList.find(l => String(l.id) === String(selectedLawanTransaksi));
                      const isBadanUsaha = lawan?.is_badan_usaha;
                      const akun = akunPerkiraanOptions[0]?.find(a => a.id === selectedAkunPerkiraan[0]);
                      const pajakList = akun?.pajak?.filter(p => p.is_badan_usaha === isBadanUsaha) || [];

                      // Show pajak section if akun perkiraan has pajak options
                      if (!akun || pajakList.length === 0) return null;

                      const currentDppValue = dppValues[0] || rows[0].Jumlah || '0';
                      const rowPajak = pajakRows[0]?.[0]; // Always use first index

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          {/* Pajak Details */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                              <InputLabel>Pajak</InputLabel>
                              <Select
                                value={rowPajak?.pajakId || ""}
                                label="Pajak"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const selectedPajakItem = pajakList.find(p => p.id === e.target.value);
                                    if (selectedPajakItem) {
                                      // Update parent's selectedPajak
                                      onPajakChange({
                                        pajakId: selectedPajakItem.id,
                                        nama: selectedPajakItem.nama,
                                        persentase: selectedPajakItem.persentase
                                      });

                                      // Update pajakRows
                                      const updatedPajakRows = {
                                        0: [{  // Always use first index
                                          pajakId: selectedPajakItem.id,
                                          dpp: currentDppValue,
                                          persentase: String(selectedPajakItem.persentase)
                                        }]
                                      };
                                      setLocalPajakRows(updatedPajakRows);
                                      onPajakRowsChange(updatedPajakRows);
                                    }
                                  } else {
                                    onPajakChange(null);
                                    const updatedPajakRows = { 0: [] };
                                    setLocalPajakRows(updatedPajakRows);
                                    onPajakRowsChange(updatedPajakRows);
                                  }
                                }}
                              >
                                <MenuItem value="">Pilih Pajak</MenuItem>
                                {pajakList.map((p) => (
                                  <MenuItem key={p.id} value={p.id}>
                                    {p.nama} ({p.persentase}%)
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {rowPajak && (
                              <>
                                <TextField
                                  label="DPP"
                                  value={currentDppValue}
                                  onChange={(e) => handleDppChange(0, e.target.value)} // Always use first index
                                  size="small"
                                  sx={{ width: 120 }}
                                />
                                <TextField
                                  label="Persentase"
                                  value={rowPajak.persentase || "0"}
                                  size="small"
                                  sx={{ width: 120 }}
                                  InputProps={{ endAdornment: <span>%</span> }}
                                  disabled={true}
                                />
                                <IconButton onClick={() => handleDeletePajak(0, 0)}> {/* Always use first index */}
                                  <Delete />
                                </IconButton>
                              </>
                            )}
                          </div>

                          {/* Tax Summary */}
                          {rowPajak && (
                            <div style={{ 
                              background: "#e3f2fd", 
                              padding: "12px 16px", 
                              borderRadius: "4px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 8
                            }}>
                              {(() => {
                                const { pajakValue, totalSetelahPajak } = calculatePajakValues(currentDppValue, rowPajak.persentase);
                                return (
                                  <>
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
                                        <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Sisa DPP setelah pajak</div>
                                        <FieldText
                                          label="Sisa DPP setelah pajak"
                                          value={formatRupiah(totalSetelahPajak)}
                                          disabled
                                          sx={{ width: "100%" }}
                                        />
                                      </div>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>
                                      DPP sudah termasuk pajak
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
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
