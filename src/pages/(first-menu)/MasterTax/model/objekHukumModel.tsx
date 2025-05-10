export interface ObjekDetail {
  id: number;
  kodeObjek: string;
  namaObjek: string;
  deskripsiObjek: string;
  persentase: number;
  checked?: boolean;
  akunObjekPajakIsBadanUsaha: boolean;
}

export interface SubObjek {
  id: number;
  kodeObjek: string;
  namaObjek: string;
  deskripsiObjek: string;
  detail: ObjekDetail[];
  subData?: SubDataRow[];
}

export interface SubDataRow {
  [key: string]: string;
}

export interface ObjekHukumData {
  id?: number;
  kodeObjek?: string;
  namaObjek?: string;
  deskripsiObjek?: string;
  subData?: SubObjek[];
  page?: number;
  limit?: Number;
  companyId?: string;
}

interface AkunPerkiraan {
  id: string;
  kode_akun: string;
  nama_akun: string;
  keterangan?: string;
}

export interface InfoSubObjek {
  id: number;
  kodeAkun: string;
  namaAkun: string;
  keterangan?: string;
  detail?: ObjekDetail[];
}

export interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

export interface Props {
  data: ObjekHukumData[];
}

export const mapObjekPajakData = (data: any[]): ObjekHukumData[] => {
  return data.map((objek) => ({
    id: objek.id,
    kodeObjek: objek.kode_objek,
    namaObjek: objek.nama_objek,
    deskripsiObjek: objek.deskripsi_objek,
    subData:
      objek.ObjekPajakSubs?.map((sub: any) => ({
        id: sub.id,
        kodeObjek: sub.kode_objek,
        namaObjek: sub.nama_objek,
        deskripsiObjek: sub.deskripsi_objek,
        detail:
          sub.ObjekPajakDetails?.map((detail: any) => ({
            id: detail.id,
            kodeObjek: detail.kode_objek,
            namaObjek: detail.nama_objek,
            deskripsiObjek: detail.deskripsi_objek,
            persentase: detail.persentase,
          })) || [],
      })) || [],
  }));
};
