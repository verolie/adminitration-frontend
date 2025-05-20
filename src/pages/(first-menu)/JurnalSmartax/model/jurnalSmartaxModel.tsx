export interface JurnalSmartaxFormData {
  faktur: string;
  tgl: string;
  total_debit: string;
  total_kredit: string;
  lawan_transaksi_id: string;
  objek_pajak_id: string;
  jumlah_pajak: string | null;
  persentase_pajak: string | null;
  dpp: string | null;
  is_smart_tax: boolean;
  jurnal_detail: string; // JSON.stringify dari array detail
  file?: File;
  company_id: string;
}
