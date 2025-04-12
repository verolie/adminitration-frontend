export interface JurnalUmum {
  id?: string;
  faktur?: string;
  companyId?: string;
  tgl?: string;
  totalDebit?: number;
  totalKredit?: number;
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
