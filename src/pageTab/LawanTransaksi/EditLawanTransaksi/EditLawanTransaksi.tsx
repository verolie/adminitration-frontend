import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { updateLawanTransaksi } from "../lawanTransaksiApi";
import styles from "./styles.module.css";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { LawanTransaksiModel } from "../lawanTransaksiModel";
import { fetchLawanTransaksiById } from "../fetchLawanTransaksiById ";
import SelectedTextField from "@/component/textField/selectedText";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";

interface Props {
  lawanTransaksiId: string;
  id: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditLawanTransaksi({
  lawanTransaksiId,
  id,
  onClose,
  onSuccess,
}: Props) {
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

  useEffect(() => {
    const companyId = localStorage.getItem("companyID") || "";
    fetchLawanTransaksiById(companyId, id).then((data) => {
      if (data) {
        setNama(data.nama);
        setNpwp(data.npwp);
        setNik(data.nik || "");
        setNitku(data.nitku || "");
        setAlamat(data.alamat);
        setIsBadanUsaha(data.is_badan_usaha);
        setContactPerson(data.contact_person || "");
        setTelpon(data.telepon || "");
        setAkunPerkiraanId(data.akun_hutang.id?.toString() || "");
        setEmail(data.email || "");
      }
    });
  }, [id]);

  useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

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
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = localStorage.getItem("companyID");
    if (companyId) {
      const updatedData = {
        id: parseInt(lawanTransaksiId),
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
      await updateLawanTransaksi(companyId, updatedData);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      console.error("companyId not found in localStorage");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography>Edit Lawan Transaksi</Typography>
        </div>
        <form className={styles.editFilterTable} onSubmit={handleSubmit}>
          <div className={styles.filterTextField}>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">Nama</Typography>
              <FieldText
                label="Nama"
                value={nama}
                onChange={handleNamaChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">NPWP</Typography>
              <FieldText
                label="NPWP"
                value={npwp}
                onChange={handleNpwpChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">NIK</Typography>
              <FieldText label="NIK" value={nik} onChange={handleNikChange} />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">NITKU</Typography>
              <FieldText
                label="NITKU"
                value={nitku}
                onChange={handleNitkuChange}
              />
            </div>
            <div style={{ flex: 2 }}>
              <Typography variant="subtitle2">Alamat</Typography>
              <FieldText
                label="Alamat"
                value={alamat}
                onChange={handleAlamatChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">Contact Person</Typography>
              <FieldText
                label="Contact Person"
                value={contactPerson}
                onChange={handleContactPersonChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">Telepon</Typography>
              <FieldText
                label="Telepon"
                value={telpon}
                onChange={handleTelponChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">Email</Typography>
              <FieldText
                label="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">Akun Perkiraan</Typography>
              <SelectedTextField
                label="Akun Perkiraan"
                value={akunPerkiraanId}
                onChange={handleAkunPerkiraanChange}
                options={akunOptions}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
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
          <div className={styles.buttonLabel}>
            <Button
              size="large"
              variant="confirm"
              label="Simpan"
              type="submit"
            />
            <Button
              size="large"
              variant="warning"
              label="Batal"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
