"use client";

import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoLaporanLabaRugi from "./page/InfoLaporanLabaRugi/InfoLaporanLabaRugi";
import GenerateLaporanLabaRugi from "./page/GenerateLaporanLabaRugi/GenerateLaporanLabaRugi";

export default function LaporanLabaRugi() {
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
          content: <GenerateLaporanLabaRugi />,
          closable: true,
        },
      ]);
    }
  };

  const handleRemoveTab = (label: string) => {
    setDynamicTabs((prev) => prev.filter((tab) => tab.label !== label));
  };

  const tabs = [
    { label: "Info", content: <InfoLaporanLabaRugi onGenerate={handleAddGenerateTab} /> },
    ...dynamicTabs
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
} 