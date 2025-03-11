import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import OverviewPage from "../OverviewPage/OverviewPage";
import SettingsPage from "../SettingPage/SettingPage";

export default function DetailsPage() {
  const tabs = [
    { label: "Overview", content: <OverviewPage /> },
    { label: "Settings", content: <SettingsPage /> },
  ];

  return (
    <>
      <div>Ini halaman Details</div>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
