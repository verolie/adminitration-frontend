"use client";

import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import GenerateLaporanLabaRugi from "./page/GenerateLaporanLabaRugi/GenerateLaporanLabaRugi";

export default function LaporanLabaRugi() {
  const tabs = [
    { label: "Generate Report", content: <GenerateLaporanLabaRugi />, closable: false },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" onRemoveTab={() => {}} />
    </>
  );
} 