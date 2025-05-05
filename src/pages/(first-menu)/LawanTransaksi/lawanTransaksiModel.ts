export interface LawanTransaksiModel {
    id: number;
    nama: string;
    npwp: string;
    nik: string | null;
    nitku: string | null;
    alamat: string;
    is_badan_usaha: boolean;
    created_at: string;
    updated_at: string;
  }