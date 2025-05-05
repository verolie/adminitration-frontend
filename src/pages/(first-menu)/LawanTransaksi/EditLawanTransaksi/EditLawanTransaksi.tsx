import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { updateLawanTransaksi } from "../lawanTransaksiApi";
import styles from "./styles.module.css";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { LawanTransaksiModel } from "../lawanTransaksiModel";
import { fetchLawanTransaksiById } from "../fetchLawanTransaksiById ";

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
  const [contactPerson, setContactPerson] = useState(""); // Tambah state untuk Contact Person
  const [telpon, setTelpon] = useState(""); // Tambah state untuk Nomor Telepon

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
        setContactPerson(data.contact_person || ""); // Set initial value, handle null/undefined
        setTelpon(data.telpon || ""); // Set initial value, handle null/undefined
      }
    });
  }, [id]);

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
    setContactPerson(e.target.value); // Handler untuk Contact Person
  const handleTelponChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTelpon(e.target.value); // Handler untuk Nomor Telepon

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
        contact_person: contactPerson, // Sertakan Contact Person
        telpon: telpon, // Sertakan Nomor Telepon
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
