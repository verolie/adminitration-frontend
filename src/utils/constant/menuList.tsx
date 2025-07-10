import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import StorageIcon from '@mui/icons-material/Storage';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Image from "next/image";
import React from "react";
import styles from "./style/menuBar.module.css";
import Home from "@/pages/(first-menu)/Home/Home";
import Company from "@/pages/(first-menu)/Company/Company";
import AkunPerkiraan from "@/pages/(first-menu)/AkunPerkiraan/AkunPerkiraan";
import JurnalUmum from "@/pages/(first-menu)/JurnalUmum/JurnalUmum";
import ObjekPajak from "@/pages/(first-menu)/ObjekHukum/ObjekPajak";
import User from "@/pages/(first-menu)/User/User";
import LawanTransaksi from "@/pages/(first-menu)/LawanTransaksi/lawanTransaksi";
import MasterTax from "@/pages/(first-menu)/MasterTax/MasterTax";
import JurnalSmartax from "@/pages/(first-menu)/JurnalSmartax/JurnalSmartax";
import LaporanLabaRugi from "@/pages/(first-menu)/LaporanLabaRugi/LaporanLabaRugi";
import MappingLabaRugi from "@/pages/(first-menu)/MappingLabaRugi/LaporanLabaRugi";

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
    ],
    roles: ["Laporan"],
  },
];
