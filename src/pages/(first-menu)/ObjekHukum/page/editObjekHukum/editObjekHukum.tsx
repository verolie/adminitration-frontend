"use client";

import { useEffect, useState } from "react";
import ObjekHukumAccordion from "../../function/acordionTableObjekHukum";
import { mapObjekHukumData, ObjekHukumData } from "../../model/objekHukumModel";
import { fetchObjekHukumData } from "../../function/fetchObjekHukumDataEdit";
import { fetchObjekHukumDataMember } from "../../function/fetchObjekHukumDataMember";
import { fetchAkunPerkiraanDetail } from "@/pages/(first-menu)/AkunPerkiraan/function/fetchAkunPerkiraanDetail";
import { AkunPerkiraan } from "@/pages/(first-menu)/AkunPerkiraan/model/AkunPerkiraanModel";
import SelectedTextField from "@/component/textField/selectedText";
import Button from "@/component/button/button";
import { Refresh } from "@mui/icons-material";
import styles from "./styles.module.css";

const EditObjekHukum = () => {
  const [data, setData] = useState<ObjekHukumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] =
    useState<string>("");
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("companyID") : null;

  useEffect(() => {
    fetchCombinedData();
    fetchAkunPerkiraanList();
  }, []);

  const fetchCombinedData = async () => {
    if (!token || !companyId) {
      console.warn("Token atau companyID tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      const [objekDataRes, memberDataRes] = await Promise.all([
        fetchObjekHukumData({ page: 1, limit: 200 }, token),
        fetchObjekHukumDataMember({ page: 1, limit: 200, companyId }, token),
      ]);

      const allData = mapObjekHukumData(objekDataRes);

      // Ambil list kode objek yang sudah dichecklist
      const memberObjekSet = new Set(
        memberDataRes.flatMap((item: any) =>
          item.detail?.map((d: any) => d.kodeObjek)
        )
      );

      const mergedData = allData.map((item) => ({
        ...item,
        checked: memberObjekSet.has(item.kodeObjek), // contoh penanda checklist
      }));

      setData(mergedData);
    } catch (err: any) {
      console.error("Gagal fetch data:", err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAkunPerkiraanList = async () => {
    if (!token || !companyId) return;
    try {
      const akunData = await fetchAkunPerkiraanDetail(
        { companyId: companyId, page: 1, limit: 100 },
        token
      );

      console.log("akun data", akunData);

      const options = akunData.map((item: AkunPerkiraan) => ({
        label: `${item.kode_akun} - ${item.nama_akun}`,
        value: item.kode_akun,
      }));

      setAkunPerkiraanOptions(options);
    } catch (err) {
      console.error("Gagal fetch akun perkiraan:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.editFilterTable}>
        <div className={styles.filterTextField}>
          <SelectedTextField
            label="Akun Perkiraan"
            options={akunPerkiraanOptions}
            value={selectedAkunPerkiraan}
            onChange={(e) => setSelectedAkunPerkiraan(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.scrollContent}>
        <ObjekHukumAccordion data={data} />
      </div>
    </div>
  );
};

export default EditObjekHukum;
