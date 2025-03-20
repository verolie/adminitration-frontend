import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import BuildIcon from "@mui/icons-material/Build";
import Image from "next/image";
import React from "react";
import styles from "./style/menuBar.module.css";
import Home from "@/pages/(first-menu)/Home/Home";
import Company from "@/pages/(first-menu)/Company/Company";
import AkunPerkiraan from "@/pages/(first-menu)/AkunPerkiraan/AkunPerkiraan";
import JurnalUmum from "@/pages/(first-menu)/JurnalUmum/JurnalUmum";

interface MenuList {
  no: number;
  label: string;
  path: React.ReactNode; // Bisa berupa komponen
  icon: React.ReactNode;
  submenu?: SubItemList[] | null;
  roles?: string[];
}

interface SubItemList {
  label: string;
  path: React.ReactNode; // Bisa berupa komponen
  roles: string[];
}

export const menuList: MenuList[] = [
  {
    no: 1,
    label: "Home",
    path: <Home />, // Menggunakan komponen
    icon: <HomeIcon className={styles.icon} />,
    submenu: null,
    roles: ["Dashboard"],
  },
  {
    no: 2,
    label: "Perusahaan",
    path: <Company />,
    icon: <DomainIcon className={styles.icon} />,
    submenu: null,
    roles: ["Company"],
  },
  {
    no: 3,
    label: "Buku Besar",
    path: "",
    icon: (
      <Image
        src="/images/icon/buku-besar.svg"
        width={22}
        height={28}
        alt="Unit Icon"
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
        label: "Akun Perkiraan",
        path: <AkunPerkiraan />,
        roles: ["Akun Perkiraan"],
      },
    ],
    roles: ["Sub-Division"],
  },
];
