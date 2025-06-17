"use client";

import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoLaporanLabaRugi from "./page/InfoLaporanLabaRugi/InfoLaporanLabaRugi";

export default function LaporanLabaRugi() {
  const tabs = [
    { label: "Info", content: <InfoLaporanLabaRugi /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
} 