export interface JurnalUmum {
  id?: string;
  faktur?: string;
  companyId?: string;
  tgl?: string;
  totalDebit?: number;
  totalKredit?: number;
  deskripsi?: string; // Tambahkan deskripsi di sini
  file?: string | File; // Tambahkan file di sini
  lawan_transaksi_id?: string;
  objek_pajak_id?: string;
  jumlah_pajak?: number;
  persentase_pajak?: number;
  dpp?: number;
  is_smart_tax?: boolean;
  jurnalDetail?: JurnalDetail[];
  page?: number;
  limit?: number;
}

export interface JurnalDetail {
  id?: string;
  akunPerkiraanDetailId?: number;
  bukti?: string;
  debit?: number;
  kredit?: number;
  urut?: number;
  keterangan?: string;
}
