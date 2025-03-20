import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import OverviewPage from "../OverviewPage/OverviewPage";
import SettingsPage from "../SettingPage/SettingPage";
import InfoAkunPerkiraan from "./SubPage/Info/InfoAkunPerkiraan";
import DataBaru from "./SubPage/DataBaruAkunPerkiraan/DataBaru";

export default function AkunPerkiraan() {
  const tabs = [
    { label: "Info", content: <InfoAkunPerkiraan /> },
    { label: "Data Baru", content: <DataBaru /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
