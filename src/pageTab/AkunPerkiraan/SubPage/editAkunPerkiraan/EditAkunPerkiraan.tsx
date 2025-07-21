import * as React from "react";
import styles from "./styles.module.css";
import { Typography, FormControlLabel, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import AreaText from "@/component/textField/areaText";
import ModernSwitch from "@/component/textField/modernSwitch";
import { editAkunPerkiraan } from "../../function/editAkunPerkiraan";
import { fetchAkunPerkiraan as fetchAkunPerkiraan } from "../../function/fetchAkunPerkiraan";
import { fetchAkunPerkiraanInduk } from "../../function/fetchAkunPerkiraanInduk";
import { fetchAkunPerkiraanSub } from "../../function/fetchAkunPerkiraanSub";
import { useAlert } from "@/context/AlertContext";
import { formatNumber, unformatNumber, isNumericInput } from "@/utils/formatNumber";

interface EditJurnalUmumProps {
  id: string;
  level: string;
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
  level,
  onClose,
}: EditJurnalUmumProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { showAlert } = useAlert();
  const [kodePerkiraanValue, setKodePerkiraanValue] = React.useState("");
  const [namaValue, setNamaValue] = React.useState("");
  const [saldoValue, setSaldoValue] = React.useState("");
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState("");
  const [catatanValue, setCatatanValue] = React.useState("");
  const [preferenceValue, setPreferenceValue] = React.useState(false);
  const [levelAkun, setLevelAkun] = React.useState<"induk" | "sub" | "detail" | "">("");
  const [selectedIndukAkun, setSelectedIndukAkun] = React.useState("");
  const [selectedSubAkun, setSelectedSubAkun] = React.useState("");
  const [indukAkunList, setIndukAkunList] = React.useState<{ value: string; label: string }[]>([]);
  const [subAkunList, setSubAkunList] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    if (levelAkun === "induk") {
      setSelectedIndukAkun("");
    }
    fetchData();
  }, [levelAkun]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");
    if (!companyId || !token) return;

    if (levelAkun === "sub") {
      try {
        const result = await fetchAkunPerkiraanInduk({ companyId }, token);
        setIndukAkunList(
          result.map((item: any) => ({
            value: item.id,
            label: `${item.kode_akun} - ${item.nama_akun}`,
          }))
        );
      } catch (error) {
        console.error("Gagal ambil akun induk", error);
        showAlert("Gagal mengambil data akun induk", "error");
      }
    }

    if (levelAkun === "detail") {
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
        showAlert("Gagal mengambil data akun sub", "error");
      }
    }
  };

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
            value: parseInt(id, 10),
            operator: "equals",
          },
          jenis_akun: {
            value: level,
            operator: "equals",
          },
        };

        const akunList = await fetchAkunPerkiraan({ companyId }, token, filter);

        const filteredAkunList = akunList.filter((akun: any) => akun.jenis_akun === level);
        const akun = filteredAkunList?.[0];

        if (akun) {
          if (level === "sub") {
            const filteredAkunIndukList = akunList.filter((akun: any) => akun.jenis_akun === "induk");
            const akunInduk = filteredAkunIndukList?.[0];

            setSelectedIndukAkun(akunInduk !== undefined ? akunInduk.id : "");
          }

          if (level === "detail") {
            const filteredAkunSubList = akunList.filter((akun: any) => akun.jenis_akun === "sub");
            const akunSub = filteredAkunSubList?.[0];

            setSelectedIndukAkun(akunSub !== undefined ? akunSub.id : "");
          }

          setLevelAkun(level as "induk" | "sub" | "detail");
          setKodePerkiraanValue(akun.kode_akun || "");
          setNamaValue(akun.nama_akun || "");
          setSaldoValue(formatNumber(akun.saldo?.toString() || "0"));
          setTanggalAwalValue(akun.tanggal_awal || "");
          setCatatanValue(akun.keterangan || "");
          setPreferenceValue(akun.is_preference || false);
        } else {
          setError("Data akun tidak ditemukan");
          showAlert("Data akun tidak ditemukan", "error");
        }
      } catch (err: any) {
        console.error("Gagal fetch detail akun:", err.message);
        setError("Gagal memuat data akun");
        showAlert("Gagal memuat data akun", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailAndSetup();
  }, [id, level, showAlert]);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const handleSaldoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNumericInput(rawValue)) return;
    const formatted = formatNumber(rawValue);
    setSaldoValue(formatted);
  };

  const handleCatatanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCatatanValue(event.target.value);
  };

  const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferenceValue(event.target.checked);
  };

  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token || !companyId || !levelAkun) {
      console.error("Token, Company ID, atau level akun tidak tersedia");
      return;
    }

    try {
      let payload: any = {
        id,
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
        if(saldoValue.endsWith('.') || isNaN(parseFloat(saldoValue))) {
          showAlert("Saldo harus berupa angka", "error");
          return;
        }
        payload = {
          ...payload,
          akunPerkiraanSubId: selectedIndukAkun,
          saldo: unformatNumber(saldoValue),
          tanggalAwal: tanggalAwalValue,
          preference: preferenceValue
        };
      }

      const message = await editAkunPerkiraan(payload, levelAkun, token);
      showAlert("Data berhasil disimpan", "success");
      onClose();
    } catch (error: any) {
      showAlert(`Gagal edit akun: ${error.message}`, "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Akun Perkiraan</Typography>
        </div>
        <div className={styles.container}>
          <div className={styles.inputField}>
            <Typography className={styles.labelText}>Opsi Akun</Typography>
            <SelectedTextField
              label="Opsi Akun"
              value={levelAkun}
              onChange={(e) => setLevelAkun(e.target.value as "induk" | "sub" | "detail")}
              options={[
                { value: "induk", label: "Induk" },
                { value: "sub", label: "Sub" },
                { value: "detail", label: "Detail" },
              ]}
              readOnly={true}
            />
          </div>
          {(levelAkun === "sub" || levelAkun === "detail") && (
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>
                {levelAkun === "sub" ? "Induk Akun" : "Sub Akun"}
              </Typography>
              <SelectedTextField
                label={levelAkun === "sub" ? "Induk Akun" : "Sub Akun"}
                value={selectedIndukAkun}
                onChange={(e) => setSelectedIndukAkun(e.target.value)}
                options={levelAkun === "sub" ? indukAkunList : subAkunList}
              />
            </div>
          )}
        </div>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Informasi Umum</Typography>
        </div>
        <div className={styles.container}>
          <div className={styles.inputField}>
            <Typography className={styles.labelText}>Kode Perkiraan</Typography>
            <FieldText
              label="Kode Perkiraan"
              value={kodePerkiraanValue}
              onChange={(e) => setKodePerkiraanValue(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <Typography className={styles.labelText}>Nama</Typography>
            <FieldText
              label="Nama"
              value={namaValue}
              onChange={handleNamaChange}
            />
            <Typography className={styles.infoText}>
              Contoh: BCA a/c XXX-XXX, dll
            </Typography>
          </div>
          {levelAkun === "detail" && (
            <div className={styles.inputField} style={{ marginTop: '-4px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FormControlLabel
                  control={
                    <ModernSwitch
                      checked={preferenceValue}
                      onChange={handlePreferenceChange}
                    />
                  }
                  label={
                    <Typography style={{ 
                      fontSize: '14px',
                      color: '#333F50',
                      marginLeft: '8px',
                      fontWeight: 600
                    }}>
                      Preference
                    </Typography>
                  }
                  style={{
                    margin: 0,
                    alignItems: 'center'
                  }}
                />
                <Tooltip 
                  title="Akun ini akan digunakan sebagai preferensi untuk pencatatan transaksi perpajakan" 
                  placement="right"
                  arrow
                >
                  <IconButton 
                    size="small" 
                    style={{ 
                      padding: '4px',
                      color: '#00569f'
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontSize: '20px' }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </div>

        {(levelAkun === "detail") && (
          <>
            <div className={styles.titleField}>
              <Typography className={styles.titleText}>Saldo</Typography>
            </div>
            <div className={styles.container}>
              <div className={styles.inputField}>
                <Typography className={styles.labelText}>Saldo Perkiraan</Typography>
                <FieldText
                  label="Saldo"
                  value={saldoValue}
                  onChange={handleSaldoChange}
                />
              </div>
            </div>
          </>
        )}

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
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonLabel}>
        <Button
          size="large"
          variant="confirm"
          label="Save"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}
