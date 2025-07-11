"use client";

import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoLaporanNeraca from "./page/InfoLaporanNeraca/InfoLaporanNeraca";
import GenerateLaporanNeraca from "./page/GenerateLaporanNeraca/GenerateLaporanNeraca";

export default function LaporanNeraca() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  const handleAddGenerateTab = () => {
    const label = "Generate Report";
    const isExist = dynamicTabs.find((tab) => tab.label === label);
    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: <GenerateLaporanNeraca />,
          closable: true,
        },
      ]);
    }
  };

  const handleRemoveTab = (label: string) => {
    setDynamicTabs((prev) => prev.filter((tab) => tab.label !== label));
  };

  const tabs = [
    { label: "Info", content: <InfoLaporanNeraca onGenerate={handleAddGenerateTab} /> },
    ...dynamicTabs
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
} 