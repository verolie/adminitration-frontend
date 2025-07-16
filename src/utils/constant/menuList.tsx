import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import StorageIcon from '@mui/icons-material/Storage';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Image from "next/image";
import React from "react";
import styles from "./style/menuBar.module.css";
import Home from "@/pageTab/Home/Home";
import Company from "@/pageTab/Company/Company";
import AkunPerkiraan from "@/pageTab/AkunPerkiraan/AkunPerkiraan";
import JurnalUmum from "@/pageTab/JurnalUmum/JurnalUmum";
import ObjekPajak from "@/pageTab/ObjekHukum/ObjekPajak";
import User from "@/pageTab/User/User";
import LawanTransaksi from "@/pageTab/LawanTransaksi/lawanTransaksi";
import MasterTax from "@/pageTab/MasterTax/MasterTax";
import JurnalSmartax from "@/pageTab/JurnalSmartax/JurnalSmartax";
import LaporanLabaRugi from "@/pageTab/LaporanLabaRugi/LaporanLabaRugi";
import MappingLabaRugi from "@/pageTab/MappingLabaRugi/LaporanLabaRugi";
import MappingLaporanNeraca from "@/pageTab/MappingLaporanNeraca/LaporanNeracaMapping";
import LaporanNeraca from "@/pageTab/LaporanNeraca/LaporanNeraca";

interface MenuList {
  no: number;
  label: string;
  path: React.ReactNode;
  icon: React.ReactNode;
  submenu?: SubItemList[] | null;
  roles?: string[];
}

interface SubItemList {
  label: string;
  path: React.ReactNode;
  roles: string[];
}

// Anda bisa mengganti ikonnya dengan ikon yang sesuai dari Material UI atau library ikon lainnya

export const menuList: MenuList[] = [
  {
    no: 1,
    label: "Home",
    path: <Home />,
    icon: <HomeIcon className={styles.icon} />,
    submenu: null,
    roles: ["Dashboard"],
  },
  {
    no: 2,
    label: "Perusahaan",
    path: "",
    icon: <DomainIcon className={styles.icon} />,
    submenu: [
      {
        label: "Profil Perusahaan",
        path: <Company />,
        roles: ["Company"],
      },
      {
        label: "User Management",
        path: <User />,
        roles: ["User Management"],
      },
    ],
    roles: ["Company"],
  },
  {
    no: 3,
    label: "Master",
    path: "",
    icon: <StorageIcon className={styles.icon} />,
    submenu: [
      {
        label: "Akun Perkiraan",
        path: <AkunPerkiraan />,
        roles: ["Akun Perkiraan"],
      },
      {
        label: "Lawan Transaksi",
        path: <LawanTransaksi />,
        roles: ["Lawan Transaksi"],
      },
      {
        label: "Master Tax",
        path: <MasterTax />,
        roles: ["Master Tax"],
      },
      {
        label: "Mapping Objek Pajak",
        path: <ObjekPajak />,
        roles: ["Mapping Objek Pajak"],
      },
    ],
    roles: ["Master"],
  },
  {
    no: 4,
    label: "Transaksi",
    path: "",
    icon: <CompareArrowsIcon className={styles.icon} />,
    submenu: [
      {
        label: "Jurnal Umum",
        path: <JurnalUmum />,
        roles: ["Jurnal Umum"],
      },
      {
        label: "Jurnal Smartax",
        path: <JurnalSmartax />,
        roles: ["Jurnal Smartax"],
      },
      {
        label: "Mapping Laba Rugi",
        path: <MappingLabaRugi />,
        roles: ["Laporan Laba Rugi"],
      },
      {
        label: "Mapping Laporan Neraca",
        path: <MappingLaporanNeraca />,
        roles: ["Laporan Neraca"],
      },
    ],
    roles: ["Transaksi"],
  },
  {
    no: 5,
    label: "Laporan",
    path: "",
    icon: <AssessmentIcon className={styles.icon} />,
    submenu: [
      {
        label: "Laporan Laba Rugi",
        path: <LaporanLabaRugi />,
        roles: ["Laporan Laba Rugi"],
      },
      {
        label: "Laporan Neraca",
        path: <LaporanNeraca />,
        roles: ["Laporan Neraca"],
      },
    ],
    roles: ["Laporan"],
  },
];
