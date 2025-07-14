"use client";

import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import GenerateLaporanNeraca from "./generateLaporanNeraca/generateLaporanNeraca";

export default function LaporanNeraca() {
  const tabs = [
    { label: "Generate Report", content: <GenerateLaporanNeraca />, closable: false },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" onRemoveTab={() => {}} />
    </>
  );
} 