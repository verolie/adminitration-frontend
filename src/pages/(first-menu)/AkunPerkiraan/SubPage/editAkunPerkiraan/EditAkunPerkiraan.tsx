import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import AreaText from "@/component/textField/areaText";
import { fetchAkunPerkiraanSub } from "../../function/fetchAkunPerkiraanSub";
import { createAkunPerkiraan } from "../../function/createAkunPerkiraan";
import { fetchAkunPerkiraanDetail } from "../../function/fetchAkunPerkiraanDetail";
import { fetchAkunPerkiraan } from "../../function/fetchAkunPerkiraan";

const accountType = [
  { id: 1, name: "Asset" },
  { id: 2, name: "Utang" },
  { id: 3, name: "Modal" },
  { id: 4, name: "Pendapatan" },
  { id: 5, name: "Beban" },
];

interface EditJurnalUmumProps {
  id: string;
  onClose: () => void;
}

type FilterOperator = "equals" | "contains";

type FilterValue = {
  value: string | number;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export default function EditAkunPerkiraan({
  id,
  onClose,
}: EditJurnalUmumProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [selectedAcctType, setSelectedAcctType] = React.useState<number | "">(
    ""
  );
  const [kodePerkiraanValue, setKodePerkiraanValue] = React.useState("");
  const [namaValue, setNamaValue] = React.useState("");
  const [saldoValue, setSaldoValue] = React.useState("");
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState("");
  const [catatanValue, setCatatanValue] = React.useState("");
  const [levelAkun, setLevelAkun] = React.useState<
    "induk" | "sub" | "detail" | ""
  >("");
  const [selectedIndukAkun, setSelectedIndukAkun] = React.useState("");
  const [selectedSubAkun, setSelectedSubAkun] = React.useState("");
  const [indukAkunList, setIndukAkunList] = React.useState([]);
  const [subAkunList, setSubAkunList] = React.useState([]);

  React.useEffect(() => {
    setSelectedIndukAkun("");
    setSelectedSubAkun("");
  }, [levelAkun]);

  React.useEffect(() => {
    const fetchDetailAndSetup = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId || !id) return;

      setIsLoading(true);
      setError("");

      try {
        const filter: FilterInput = {
          id: {
            value: parseInt(id, 10), // Mengubah id menjadi integer dengan basis 10
            operator: "equals",
          },
        };

        const akunList = await fetchAkunPerkiraanDetail(
          { companyId },
          token,
          filter
        );
        const akun = akunList?.[0];

        if (akun) {
          const akunLevel = akun.level;

          // Set semua state berdasarkan data yang difetch
          setLevelAkun(akunLevel);
          setKodePerkiraanValue(akun.kode_akun || "");
          setNamaValue(akun.nama_akun || "");
          setSaldoValue(akun.saldo_awal?.toString() || "");
          setTanggalAwalValue(akun.tanggal_awal || "");
          setCatatanValue(akun.keterangan || "");
          setSelectedAcctType(akun.tipe_akun_id || "");
          setSelectedIndukAkun(akun.akun_perkiraan_induk_id || "");
          setSelectedSubAkun(akun.akun_perkiraan_sub_id || "");

          // Fetch akun induk dan sub jika perlu
          await fetchData(akunLevel, token, companyId);
        } else {
          setError("Data akun tidak ditemukan");
        }
      } catch (err: any) {
        console.error("Gagal fetch detail akun:", err.message);
        setError("Gagal memuat data akun");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailAndSetup();
  }, []);

  const fetchData = async (
    level: "induk" | "sub" | "detail",
    token: string,
    companyId: string
  ) => {
    if (level === "sub" || level === "detail") {
      try {
        const result = await fetchAkunPerkiraan({ companyId }, token);
        setIndukAkunList(
          result.map((item: any) => ({
            value: item.id,
            label: `${item.kode_akun} - ${item.nama_akun}`,
          }))
        );
      } catch (error) {
        console.error("Gagal ambil akun induk", error);
      }
    }

    if (level === "detail") {
      try {
        const result = await fetchAkunPerkiraanSub({ companyId }, token);
        setSubAkunList(
          result.map((item: any) => ({
            value: item.id,
            label: `${item.kode_akun} - ${item.nama_akun}`,
          }))
        );
      } catch (error) {
        console.error("Gagal ambil akun sub", error);
      }
    }
  };

  const handleAkunPerkiraanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKodePerkiraanValue(event.target.value);
  };

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const handleSaldoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaldoValue(event.target.value);
  };

  const handleTanggalAwalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTanggalAwalValue(event.target.value);
  };

  const handleCatatanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCatatanValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token || !companyId || !levelAkun) {
      console.error("Token, Company ID, atau level akun tidak tersedia");
      return;
    }

    try {
      let payload: any = {
        companyId,
        kodeAkun: kodePerkiraanValue,
        namaAkun: namaValue,
        keterangan: catatanValue,
      };

      if (levelAkun === "sub") {
        payload = {
          ...payload,
          akunPerkiraanIndukId: selectedIndukAkun,
        };
      }

      if (levelAkun === "detail") {
        payload = {
          ...payload,
          akunPerkiraanIndukId: selectedIndukAkun,
          akunPerkiraanSubId: selectedSubAkun,
          tipeAkunId: selectedAcctType,
          saldoAwal: saldoValue,
          tanggalAwal: tanggalAwalValue,
          status,
        };
      }

      const message = await createAkunPerkiraan(payload, levelAkun, token);
      alert(`Berhasil: ${message}`);
    } catch (error: any) {
      alert(`Gagal membuat akun: ${error.message}`);
    }
  };

  return (
    <>
      {
        <div className={styles.container}>
          <div className={styles.scrollContent}>
            <div className={styles.titleField}>
              <Typography className={styles.titleText}>
                Akun Perkiraan
              </Typography>
            </div>
            <div className={styles.container}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Opsi Akun</Typography>
                <SelectedTextField
                  label="Opsi Akun"
                  value={levelAkun}
                  onChange={(e) =>
                    setLevelAkun(e.target.value as "induk" | "sub" | "detail")
                  }
                  options={[
                    { value: "induk", label: "Induk" },
                    { value: "sub", label: "Sub" },
                    { value: "detail", label: "Detail" },
                  ]}
                />
              </div>
              {(levelAkun === "sub" || levelAkun === "detail") && (
                <div className={styles.inputField}>
                  <Typography className={styles.labelText}>
                    Induk Akun
                  </Typography>
                  <SelectedTextField
                    label="Induk Akun"
                    value={selectedIndukAkun}
                    onChange={(e) => setSelectedIndukAkun(e.target.value)}
                    options={indukAkunList}
                  />
                </div>
              )}

              {levelAkun === "detail" && (
                <div className={styles.inputField}>
                  <Typography className={styles.labelText}>Sub Akun</Typography>
                  <SelectedTextField
                    label="Sub Akun"
                    value={selectedSubAkun}
                    onChange={(e) => setSelectedSubAkun(e.target.value)}
                    options={subAkunList}
                  />
                </div>
              )}
            </div>
            <div className={styles.titleField}>
              <Typography className={styles.titleText}>
                Informasi Umum
              </Typography>
            </div>
            <div className={styles.container}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Tipe Akun</Typography>
                <SelectedTextField
                  label="Tipe Akun"
                  value={selectedAcctType}
                  onChange={(e) => setSelectedAcctType(Number(e.target.value))}
                  options={accountType.map((type) => ({
                    value: type.id,
                    label: type.name,
                  }))}
                />
              </div>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>
                  Kode Perkiraan
                </Typography>
                <FieldText
                  label="Kode Perkiraan"
                  value={kodePerkiraanValue}
                  onChange={handleAkunPerkiraanChange}
                ></FieldText>
              </div>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Nama</Typography>
                <FieldText
                  label="Nama"
                  value={namaValue}
                  onChange={handleNamaChange}
                ></FieldText>
                <Typography className={styles.infoText}>
                  Contoh: BCA a/c XXX-XXX, dll
                </Typography>
              </div>
            </div>
            <div className={styles.titleField}>
              <Typography className={styles.titleText}>Saldo</Typography>
            </div>
            <div className={styles.container}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>
                  Saldo Perkiraan
                </Typography>
                <FieldText
                  label="Saldo"
                  value={saldoValue}
                  onChange={handleSaldoChange}
                ></FieldText>
              </div>
            </div>
            <div className={styles.titleField}>
              <Typography className={styles.titleText}>Lain Lain</Typography>
            </div>
            <div className={styles.container}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Catatan</Typography>
                <AreaText
                  label="Catatan"
                  value={catatanValue}
                  onChange={handleCatatanChange}
                ></AreaText>
              </div>
            </div>
          </div>
          <div className={styles.buttonLabel}>
            <Button
              size="large"
              variant="confirm"
              label="Save"
              onClick={onSubmit("active")}
            />
            <Button
              size="large"
              variant="info"
              label="Save As Draft"
              onClick={onSubmit("submit")}
            />
          </div>
        </div>
      }
    </>
  );
}
