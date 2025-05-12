import React from "react";
import { TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styles.module.css";
import { fetchAkunPerkiraanDetail } from "./fetchAkunPerkiraanDetail";
import Button from "../../../../component/button/button";
import AkunPerkiraan from "../../AkunPerkiraan/AkunPerkiraan";
import FieldText from "../../../../component/textField/fieldText";
import { useAppContext } from "@/context/context";

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
    lawanTransaksi: string;
    bukti: string;
    Jumlah: string;
    kredit: string;
    keterangan: string;
  }[];
  lawanTransaksiList: LawanTransaksi[];
  onChange: (index: number, field: string, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
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
  onChange,
}) => {
  // State untuk akun perkiraan dan pajak per baris
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<{ [row: number]: AkunPerkiraan[] }>({});
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState<{ [row: number]: string }>({});
  const [pajakRows, setPajakRows] = React.useState<{ [row: number]: PajakRowData[] }>({});
  const [loadingAkun, setLoadingAkun] = React.useState<{ [row: number]: boolean }>({});

  const { addTab } = useAppContext();

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
          id: obj.kode_objek,
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
    rows.forEach((row, idx) => {
      if (row.lawanTransaksi && !akunPerkiraanOptions[idx] && !loadingAkun[idx]) {
        setLoadingAkun((prev) => ({ ...prev, [idx]: true }));
        const token = localStorage.getItem("token") || "";
        const companyId = localStorage.getItem("companyID") || "";
        fetchAkunPerkiraanDetail({ companyId }, token)
          .then((data) => {
            // data.data dari API
            const mapped = mapAkunPerkiraan(data);
            setAkunPerkiraanOptions((prev) => ({ ...prev, [idx]: mapped }));
            console.log("akunPerkiraanOptions", akunPerkiraanOptions);
            setLoadingAkun((prev) => ({ ...prev, [idx]: false }));
          })
          .catch(() => setLoadingAkun((prev) => ({ ...prev, [idx]: false })));
      }
    });
    // eslint-disable-next-line
  }, [rows]);

  // Handler untuk pilih akun perkiraan
  const handleAkunPerkiraanChange = (rowIdx: number, akunId: string) => {
    setSelectedAkunPerkiraan((prev) => ({ ...prev, [rowIdx]: akunId }));
    setPajakRows((prev) => ({ ...prev, [rowIdx]: [] }));
  };

  // Handler untuk hapus pajak
  const handleDeletePajak = (rowIdx: number, pajakIdx: number) => {
    setPajakRows((prev) => ({
      ...prev,
      [rowIdx]: prev[rowIdx].filter((_, i) => i !== pajakIdx),
    }));
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

  // Calculate final totals
  let finalTotalPajak = 0;
  let finalTotalJumlah = 0;

  // Calculate total jumlah from all rows
  rows.forEach((row) => {
    const jumlahValue = parseInt((row.Jumlah || '0').replace(/\D/g, "")) || 0;
    finalTotalJumlah += jumlahValue;
  });

  // Get tax values from table rows
  rows.forEach((row, idx) => {
    const lawan = lawanTransaksiList.find(l => String(l.id) === String(row.lawanTransaksi));
    const isBadanUsaha = lawan?.is_badan_usaha;
    const akun = akunPerkiraanOptions[idx]?.find(a => a.id === selectedAkunPerkiraan[idx]);
    const selectedPajak = pajakRows[idx]?.[0];
    
    if (selectedPajak) {
      const dpp = parseInt((selectedPajak.dpp || '0').replace(/\D/g, "")) || 0;
      const persentase = parseFloat(selectedPajak.persentase) || 0;
      const pajakValue = Math.ceil((dpp / (1 + (persentase / 100))) * 100) / 100;
      const totalSetelahPajak = dpp - pajakValue;
      finalTotalPajak += totalSetelahPajak;
    }
  });

  // Calculate final total after tax
  const finalTotalSetelahPajak = finalTotalJumlah - finalTotalPajak;

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
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <FormControl fullWidth size="small">
                    <Select
                      value={row.lawanTransaksi}
                      onChange={(e) => onChange(index, "lawanTransaksi", e.target.value)}
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
              {row.lawanTransaksi && (
                <tr>
                  <td colSpan={2}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "8px 0" }}>
                      <TextField
                        label="NPWP"
                        value={lawanTransaksiList.find(l => String(l.id) === String(row.lawanTransaksi))?.npwp || ""}
                        size="small"
                        fullWidth
                        disabled
                      />
                      <TextField
                        label="NIK"
                        value={lawanTransaksiList.find(l => String(l.id) === String(row.lawanTransaksi))?.nik || ""}
                        size="small"
                        fullWidth
                        disabled
                      />
                      <TextField
                        label="NITKU"
                        value={lawanTransaksiList.find(l => String(l.id) === String(row.lawanTransaksi))?.nitku || ""}
                        size="small"
                        fullWidth
                        disabled
                      />
                    </div>
                  </td>
                </tr>
              )}
              {/* Collapse Row */}
              {row.lawanTransaksi && akunPerkiraanOptions[index] && (
                <tr className={styles.collapseRow}>
                  <td colSpan={7} style={{ background: "#f5faff", padding: 0 }}>
                    <div className={styles.collapseContent}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
                        {/* Akun Perkiraan Section */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Akun Perkiraan</InputLabel>
                            <Select
                              value={selectedAkunPerkiraan[index] || ""}
                              label="Akun Perkiraan"
                              onChange={(e) => handleAkunPerkiraanChange(index, e.target.value)}
                            >
                              <MenuItem value="" disabled>Pilih Akun Perkiraan</MenuItem>
                              {akunPerkiraanOptions[index].map((akun) => (
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
                            value={row.Jumlah}
                            onChange={(e) => onChange(index, "Jumlah", formatNumber(e.target.value))}
                            size="small"
                            fullWidth
                            required
                          />
                          <TextField
                            label="Bukti"
                            value={row.bukti}
                            onChange={(e) => onChange(index, "bukti", e.target.value)}
                            size="small"
                            fullWidth
                          />
                          <TextField
                            label="Keterangan"
                            value={row.keterangan}
                            onChange={(e) => onChange(index, "keterangan", e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </div>

                        {/* Pajak Section */}
                        {(() => {
                          const lawan = lawanTransaksiList.find(l => String(l.id) === String(row.lawanTransaksi));
                          const isBadanUsaha = lawan?.is_badan_usaha;
                          const akun = akunPerkiraanOptions[index].find(a => a.id === selectedAkunPerkiraan[index]);
                          const pajakList = akun?.pajak?.filter(p => p.is_badan_usaha === isBadanUsaha) || [];
                          if (!akun || pajakList.length === 0) return null;

                          const selectedPajak = pajakRows[index]?.[0];
                          const dpp = selectedPajak?.dpp || row.Jumlah || row.kredit || "";
                          const selectedPajakDetail = pajakList.find(p => p.id === selectedPajak?.pajakId);
                          const persentase = selectedPajakDetail?.persentase || 0;
                          const dppNum = parseNumber(dpp) || 0;
                          const persenNum = parseNumber(String(persentase)) || 0;
                          const pajakValue = Math.ceil((dppNum / (1 + (persenNum / 100))) * 100) / 100;
                          const totalSetelahPajak = dppNum - pajakValue;

                          return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                              {/* Pajak Details */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                  <InputLabel>Pajak</InputLabel>
                                  <Select
                                    value={selectedPajak?.pajakId || ""}
                                    label="Pajak"
                                    onChange={(e) => {
                                      const newPajakRows = [...(pajakRows[index] || [])];
                                      if (e.target.value) {
                                        newPajakRows[0] = {
                                          pajakId: e.target.value,
                                          dpp: row.Jumlah || row.kredit || "",
                                          persentase: String(pajakList.find(p => p.id === e.target.value)?.persentase || 0)
                                        };
                                      } else {
                                        newPajakRows.splice(0, 1);
                                      }
                                      setPajakRows((prev) => ({ ...prev, [index]: newPajakRows }));
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
                                {selectedPajak?.pajakId && (
                                  <>
                                    <TextField
                                      label="DPP"
                                      value={dpp}
                                      onChange={(e) => {
                                        const formattedValue = formatNumber(e.target.value);
                                        const newPajakRows = [...(pajakRows[index] || [])];
                                        newPajakRows[0] = {
                                          ...newPajakRows[0],
                                          dpp: formattedValue,
                                        };
                                        setPajakRows((prev) => ({ ...prev, [index]: newPajakRows }));
                                        // Force re-render to update totals
                                        setPajakRows((prev) => ({ ...prev }));
                                      }}
                                      size="small"
                                      sx={{ width: 120 }}
                                    />
                                    <TextField
                                      label="Persentase"
                                      value={persentase}
                                      size="small"
                                      sx={{ width: 120 }}
                                      InputProps={{ endAdornment: <span>%</span> }}
                                      disabled={true}
                                    />
                                    <IconButton onClick={() => handleDeletePajak(index, 0)}>
                                      <Delete />
                                    </IconButton>
                                  </>
                                )}
                              </div>

                              {/* Tax Summary */}
                              {selectedPajak?.pajakId && dpp && (
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
                                      <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total harga setelah pajak</div>
                                      <FieldText
                                        label="Total harga setelah pajak"
                                        value={formatRupiah(pajakValue)}
                                        disabled
                                        sx={{ width: "100%" }}
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Pajak yang harus dibayar</div>
                                      <FieldText
                                        label="Pajak yang harus dibayar"
                                        value={formatRupiah(totalSetelahPajak)}
                                        disabled
                                        sx={{ width: "100%" }}
                                      />
                                    </div>
                                  </div>
                                  <div style={{ fontSize: "12px", color: "#888" }}>
                                    DPP sudah termasuk pajak
                                  </div>
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
            </React.Fragment>
          ))}
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
                value={formatRupiah(finalTotalJumlah)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total Pajak yang harus dibayar</div>
              <FieldText
                label="Total Pajak yang harus dibayar"
                value={formatRupiah(finalTotalPajak)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}>Total harga setelah pajak</div>
              <FieldText
                label="Total harga setelah pajak"
                value={formatRupiah(finalTotalSetelahPajak)}
                disabled
                sx={{ width: "200px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableInsertSmartTax;
