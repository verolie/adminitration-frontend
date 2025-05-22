import React, { useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { createLawanTransaksi } from "../lawanTransaksiApi";
import styles from "./styles.module.css";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import SelectedTextField from "@/component/textField/selectedText";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import { useAlert } from "@/context/AlertContext";

interface Props {
  companyId: string;
  onSuccess: () => void;
}

export default function CreateLawanTransaksi({ companyId, onSuccess }: Props) {
  const [nama, setNama] = useState("");
  const [npwp, setNpwp] = useState("");
  const [nik, setNik] = useState("");
  const [nitku, setNitku] = useState("");
  const [alamat, setAlamat] = useState("");
  const [isBadanUsaha, setIsBadanUsaha] = useState(false);
  const [contactPerson, setContactPerson] = useState("");
  const [telpon, setTelpon] = useState("");
  const [akunPerkiraanId, setAkunPerkiraanId] = useState("");
  const [akunOptions, setAkunOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [email, setEmail] = useState("");
  const { showAlert } = useAlert();

  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNama(e.target.value);
  const handleNpwpChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNpwp(e.target.value);
  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNik(e.target.value);
  const handleNitkuChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNitku(e.target.value);
  const handleAlamatChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAlamat(e.target.value);
  const handleIsBadanUsahaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsBadanUsaha(e.target.checked);
  const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setContactPerson(e.target.value);
  const handleTelponChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTelpon(e.target.value);
  const handleAkunPerkiraanChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAkunPerkiraanId(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  React.useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await fetchAkunPerkiraanDetail(
          { companyId },
          token
        );
        setAkunOptions(data);
      } catch (err) {
        console.error("Gagal fetch akun:", err);
      }
    };

    fetchAkun();
  }, [companyId]);

  const onSubmit = async (status: "active" | "draft") => {
    const formData = {
      nama,
      npwp,
      nik,
      nitku,
      alamat,
      is_badan_usaha: isBadanUsaha,
      contact_person: contactPerson,
      telepon: telpon,
      akun_hutang_id: akunPerkiraanId,
      email: email,
    };
    await createLawanTransaksi(companyId, { ...formData, status });
    onSuccess();
    setNama("");
    setNpwp("");
    setNik("");
    setNitku("");
    setAlamat("");
    setIsBadanUsaha(false);
    setContactPerson("");
    setTelpon("");
    setAkunPerkiraanId("");
    setEmail("");
    showAlert("Berhasil membuat lawan transaksi", "success");
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography>Detail Lawan Transaksi</Typography>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Nama</Typography>
            <FieldText label="Nama" value={nama} onChange={handleNamaChange} />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">NPWP</Typography>
            <FieldText label="NPWP" value={npwp} onChange={handleNpwpChange} />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">NIK</Typography>
            <FieldText label="NIK" value={nik} onChange={handleNikChange} />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">NITKU</Typography>
            <FieldText
              label="NITKU"
              value={nitku}
              onChange={handleNitkuChange}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Alamat</Typography>
            <FieldText
              label="Alamat"
              value={alamat}
              onChange={handleAlamatChange}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Contact Person</Typography>
            <FieldText
              label="Contact Person"
              value={contactPerson}
              onChange={handleContactPersonChange}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Telepon</Typography>
            <FieldText
              label="Telepon"
              value={telpon}
              onChange={handleTelponChange}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Email</Typography>
            <FieldText
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <Typography variant="subtitle2">Akun Perkiraan</Typography>
            <SelectedTextField
              label="Akun Perkiraan"
              value={akunPerkiraanId}
              onChange={handleAkunPerkiraanChange}
              options={akunOptions}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.inputField}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBadanUsaha}
                  onChange={handleIsBadanUsahaChange}
                  name="is_badan_usaha"
                />
              }
              label="Badan Usaha"
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonLabel}>
        <Button
          size="large"
          variant="confirm"
          label="Save"
          onClick={() => onSubmit("active")}
        />
        <Button
          size="large"
          variant="info"
          label="Save As Draft"
          onClick={() => onSubmit("draft")}
        />
      </div>
    </div>
  );
}
