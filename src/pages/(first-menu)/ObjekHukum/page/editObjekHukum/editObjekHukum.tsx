import { useEffect, useState } from "react";
import { AkunPerkiraan } from "@/pages/(first-menu)/AkunPerkiraan/model/AkunPerkiraanModel";
import SelectedTextField from "@/component/textField/selectedText";
import Button from "@/component/button/button";
import { Add, Refresh } from "@mui/icons-material";
import styles from "./styles.module.css";
import { fetchAkunPerkiraan } from "@/pages/(first-menu)/AkunPerkiraan/function/fetchAkunPerkiraanDetails";
import AutocompleteTextField, {
  OptionType,
} from "@/component/textField/autoCompleteText";
import Tag from "@/component/tag/tag";
import { fetchObjekPajakDetail } from "../../function/fetchObjekPajakDetail";
import { editAkunObjekPajak } from "../../function/fetchObjekPajakDataEdit";
import { fetchObjekPajakDataMember } from "../../function/fetchObjekPajakDataMember";
import { fetchAkunPerkiraanDetail } from "../../function/fetchAkunPerkiraanDetail";
import FieldText from "@/component/textField/fieldText";
import { useAlert } from "@/context/AlertContext";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

const EditObjekHukum = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = useState<
    OptionType | undefined
  >(undefined);
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedBadanUsahaOption, setSelectedBadanUsahaOption] = useState<
    OptionType | undefined
  >(undefined);
  const [selectedNonBadanUsahaOption, setSelectedNonBadanUsahaOption] =
    useState<OptionType | undefined>(undefined);
  const [objekPajakOptions, setObjekPajakOptions] = useState<OptionType[]>([]);

  const [badanUsahaList, setBadanUsahaList] = useState<OptionType[]>([]);
  const [nonBadanUsahaList, setNonBadanUsahaList] = useState<OptionType[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("companyID") : null;

  const { showAlert } = useAlert();

  useEffect(() => {
    fetchObjekPajakDetailData();
    fetchAkunPerkiraanList();
    fetchAkunPerkiraanDetailData();
  }, []);

  useEffect(() => {
    if (selectedAkunPerkiraan) {
      const fetchData = async () => {
        setBadanUsahaList([]);
        setNonBadanUsahaList([]);
        if (!token || !companyId) return;

        try {
          const filter: FilterInput = {
            id: {
              value: selectedAkunPerkiraan.value,
              operator: "equals",
            },
          };
          const result = await fetchAkunPerkiraanDetail(
            { companyId: companyId},
            token,
            filter
          );
        } catch (err) {
          console.error("Error fetching akun detail:", err);
        }

        try {
          const result = await fetchObjekPajakDataMember(
            { companyId: companyId, id: parseInt(selectedAkunPerkiraan.value) },
            token
          );
          const allDetails = result.flatMap((item) => item?.detail ?? []);

          const findOptionByLabel = (label: string) => {
            const found = objekPajakOptions.find((opt: any) =>
              opt.label.includes(label)
            );

            return found ? { label: found.label, value: found.value } : null;
          };

          const badanUsaha = allDetails.filter(
            (item) => item.akunObjekPajakIsBadanUsaha
          );
          const nonBadanUsaha = allDetails.filter(
            (item) => !item.akunObjekPajakIsBadanUsaha
          );

          setBadanUsahaList(
            badanUsaha.map((item: any) => {
              const foundOption = findOptionByLabel(item.kodeObjek);
              return {
                label: foundOption?.label ?? item.nama_objek,
                value: foundOption?.value ?? item.id,
              };
            })
          );

          setNonBadanUsahaList(
            nonBadanUsaha.map((item: any) => {
              const foundOption = findOptionByLabel(item.kodeObjek);
              return {
                label: foundOption?.label ?? item.nama_objek,
                value: foundOption?.value ?? item.id,
              };
            })
          );
        } catch (err) {
          console.error("Error fetching objek pajak data:", err);
        }
      };

      fetchData();
    }
  }, [selectedAkunPerkiraan, token, companyId]);

  const fetchAkunPerkiraanDetailData = async () => {
    if (!token || !companyId) {
      console.warn("Token atau companyID tidak ditemukan.");
      setLoading(false);
      return;
    }
  }

  const fetchObjekPajakDetailData = async () => {
    if (!token || !companyId) {
      console.warn("Token atau companyID tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchObjekPajakDetail({}, token);
      const options = result.map((item: any) => ({
        label: `${item.kode_objek} - ${item.nama_objek}`,
        value: item.id,
      }));
      setObjekPajakOptions(options);
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
      const akunData = await fetchAkunPerkiraan(
        { companyId: companyId, page: 1, limit: 100 },
        token
      );
      const options = akunData.map((item: AkunPerkiraan) => ({
        label: `${item.kode_akun} - ${item.nama_akun}`,
        value: item.id,
      }));
      setAkunPerkiraanOptions(options);
    } catch (err) {
      console.error("Gagal fetch akun perkiraan:", err);
    }
  };

  const handleTambahDataBadanUsaha = () => {
    if (selectedBadanUsahaOption) {
      setBadanUsahaList((prev) => [...prev, selectedBadanUsahaOption]);
      // Fetch the data for the added tag
      fetchObjekPajakDataMemberFetch(selectedBadanUsahaOption);
    }
  };

  const handleTambahDataNonBadanUsaha = () => {
    if (selectedNonBadanUsahaOption) {
      setNonBadanUsahaList((prev) => [...prev, selectedNonBadanUsahaOption]);
      // Fetch the data for the added tag
      fetchObjekPajakDataMemberFetch(selectedNonBadanUsahaOption);
    }
  };

  const fetchObjekPajakDataMemberFetch = async (option: OptionType) => {
    if (!token || !companyId) return;

    try {
      const result = await fetchObjekPajakDataMember(
        { companyId: companyId, id: parseInt(option.value) },
        token
      );
    } catch (err) {
      console.error("Error fetching objek pajak data member:", err);
    }
  };

  const resetFormByAkunPerkiraan = (value: OptionType | undefined) => {
    setSelectedAkunPerkiraan(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const handleEditData = async () => {
    if (!token || !companyId) {
      console.warn("Token atau companyId tidak tersedia.");
      return;
    }
    
    if (!selectedAkunPerkiraan) {
      showAlert("Silakan pilih Akun Perkiraan terlebih dahulu.", "error");
      return;
    }

    // Validasi minimal 1 objek pajak untuk badan usaha
    if (badanUsahaList.length === 0) {
      showAlert("Badan Usaha harus memiliki minimal 1 objek pajak.", "error");
      return;
    }

    // Validasi minimal 1 objek pajak untuk non badan usaha
    if (nonBadanUsahaList.length === 0) {
      showAlert("Non Badan Usaha harus memiliki minimal 1 objek pajak.", "error");
      return;
    }

    const mappings = [];

    if (badanUsahaList.length > 0) {
      mappings.push({
        objek_pajak_ids: badanUsahaList.map((item) =>
          parseInt(item.value)
        ),
        is_badan_usaha: true,
      });
    }

    if (nonBadanUsahaList.length > 0) {
      mappings.push({
        objek_pajak_ids: nonBadanUsahaList.map((item) =>
          parseInt(item.value)
        ),
        is_badan_usaha: false,
      });
    }

    const payload = {
      akun_perkiraan_detail_id: parseInt(selectedAkunPerkiraan.value),
      mappings,
    };

    try {
      const result = await editAkunObjekPajak(companyId, payload, token);
      console.log("Berhasil update:", result);
      showAlert("Berhasil update data akun objek pajak.", "success");
      // Refresh data setelah update
      fetchObjekPajakDetailData();
      fetchAkunPerkiraanList();
    } catch (err: any) {
      console.error("Gagal update:", err.message);
      showAlert("Terjadi kesalahan saat mengedit data.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.editFilterTable}>
        <div className={styles.filterTextField}>
          <AutocompleteTextField
            label="Akun Perkiraan"
            options={akunPerkiraanOptions}
            value={selectedAkunPerkiraan}
            onChange={resetFormByAkunPerkiraan}
            size="medium"
          />
        </div>
        <Button
          size="large"
          variant="confirm"
          label="save"
          onClick={handleEditData}
        />
      </div>

      <div className={styles.scrollContent}>
        <div>
          <div className={styles.SubPanel}>
            <p className={styles.labelText}>Badan Usaha</p>
            <div className={styles.panel}>
              <AutocompleteTextField
                label="Objek Pajak"
                options={objekPajakOptions}
                value={selectedBadanUsahaOption}
                onChange={setSelectedBadanUsahaOption}
                size="large"
              />                            
              <Button
                size="small"
                variant="confirm"                                                                                                               
                icon={<Add sx={{ color: "white" }} />}
                onClick={handleTambahDataBadanUsaha}
              />
            </div>
          </div>
          <div className={styles.tagPanel}>
            {badanUsahaList.map((item, idx) => (
              <Tag
                key={idx}
                label={item.label}
                onCancel={() => {
                  setBadanUsahaList((prev) =>
                    prev.filter((_, index) => index !== idx)
                  );
                  // Fetching again after tag removal
                  fetchObjekPajakDataMemberFetch(item);
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className={styles.SubPanel}>
            <p className={styles.labelText}>Non Badan Usaha</p>
            <div className={styles.panel}>
              <AutocompleteTextField
                label="Objek Pajak"
                options={objekPajakOptions}
                value={selectedNonBadanUsahaOption}
                onChange={setSelectedNonBadanUsahaOption}
                size="large"
              />
              <Button
                size="small"
                variant="confirm"
                icon={<Add sx={{ color: "white" }} />}
                onClick={handleTambahDataNonBadanUsaha}
              />
            </div>
          </div>
          <div className={styles.tagPanel}>
            {nonBadanUsahaList.map((item, idx) => (
              <Tag
                key={idx}
                label={item.label}
                onCancel={() => {
                  setNonBadanUsahaList((prev) =>
                    prev.filter((_, index) => index !== idx)
                  );
                  // Fetching again after tag removal
                  fetchObjekPajakDataMemberFetch(item);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditObjekHukum;
