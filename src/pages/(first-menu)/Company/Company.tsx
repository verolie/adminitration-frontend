import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import SettingsPage from "../SettingPage/SettingPage";
import OverviewPage from "../OverviewPage/OverviewPage";

export default function Company() {
  const tabs = [
    { label: "Info", content: <OverviewPage /> },
    { label: "Create Company", content: <SettingsPage /> },
  ];
  return (
    <>
      <div>Ini halaman Company</div>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
