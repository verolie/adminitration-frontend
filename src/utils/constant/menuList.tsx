import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import BuildIcon from "@mui/icons-material/Build";
import PolicyIcon from "@mui/icons-material/Policy";
import Image from "next/image";
import React from "react";
import styles from "./style/menuBar.module.css";
import Home from "@/pages/(first-menu)/Home/Home";
import Company from "@/pages/(first-menu)/Company/Company";
import AkunPerkiraan from "@/pages/(first-menu)/AkunPerkiraan/AkunPerkiraan";
import JurnalUmum from "@/pages/(first-menu)/JurnalUmum/JurnalUmum";
import ObjekHukum from "@/pages/(first-menu)/ObjekHukum/ObjekHukum";
import User from "@/pages/(first-menu)/User/User";

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
        alt="Buku Besar Icon"
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
  {
    no: 4,
    label: "User", // Menu User setelah Buku Besar
    path: <User />,
    icon: <PeopleAlt className={styles.icon} />, // Sesuaikan dengan icon yang diinginkan
    submenu: null,
    roles: ["User Management"], // Sesuaikan dengan role yang diperlukan
  },
  {
    no: 5,
    label: "Objek Hukum",
    path: <ObjekHukum />,
    icon: <PolicyIcon className={styles.icon} />,
    submenu: null,
    roles: ["Objek Hukum"],
  }
];
