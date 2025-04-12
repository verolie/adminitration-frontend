export interface AkunPerkiraanInduk {
  id?: string;
  kodeAkun?: string;
  companyId?: string;
  namaAkun?: string;
  keterangan?: string;
  tipeAkunId?: number;
}

export interface AkunPerkiraanSub {
  id?: string;
  kodeAkun?: string;
  companyId?: string;
  namaAkun?: string;
  keterangan?: string;
  akunPerkiraanIndukId?: number;
}

export interface AkunPerkiraanDetail {
  id?: string;
  kodeAkun?: string;
  companyId?: string;
  namaAkun?: string;
  keterangan?: string;
  akunPerkiraanSubId?: number;
}


export interface AkunPerkiraan {
  id?: string;
  companyId: string;
  page?: number;   // optional kalau nggak selalu dikirim
  limit?: number;  // optional juga
}