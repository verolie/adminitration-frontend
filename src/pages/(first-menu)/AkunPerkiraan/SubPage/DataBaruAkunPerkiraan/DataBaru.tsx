import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InformasiUmum from "./InformasiUmum/InformasiUmum";
import Saldo from "./Saldo/Saldo";
import LainLain from "./LainLain/LainLain";

export default function DataBaru() {
  const tabs = [
    { label: "Informasi Umum", content: <InformasiUmum /> },
    { label: "Saldo", content: <Saldo /> },
    { label: "Lain Lain", content: <LainLain /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
