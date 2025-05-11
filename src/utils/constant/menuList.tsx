import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PolicyIcon from "@mui/icons-material/Policy";
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
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MasterTax from "@/pages/(first-menu)/MasterTax/MasterTax";
import JurnalSmartax from "@/pages/(first-menu)/JurnalSmartax/JurnalSmartax";

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
    label: "Akuntansi",
    path: "",
    icon: (
      <Image
        src="/images/icon/buku-besar.svg"
        width={22}
        height={28}
        alt="Akuntasni Icon"
        className={styles.iconImage}
      />
    ),
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
        label: "Akun Perkiraan",
        path: <AkunPerkiraan />,
        roles: ["Akun Perkiraan"],
      },
    ],
    roles: ["Sub-Division"],
  },
  {
    no: 4,
    label: "Objek Pajak",
    path: <ObjekPajak />,
    icon: <PolicyIcon className={styles.icon} />,
    submenu: null,
    roles: ["Objek Pajak"],
  },
  {
    no: 5,
    label: "Master Tax",
    path: <MasterTax />,
    icon: <RequestQuoteIcon className={styles.icon} />, // Menggunakan ikon yang telah diganti
    submenu: null,
    roles: ["Master Tax"],
  },
  {
    no: 6,
    label: "Lawan Transaksi",
    path: <LawanTransaksi />,
    icon: <SwapHorizIcon className={styles.icon} />,
    submenu: null,
    roles: ["Lawan Transaksi"],
  },
];
