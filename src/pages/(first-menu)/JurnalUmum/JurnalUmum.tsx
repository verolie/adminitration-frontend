import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalUmum from "./InfoJurnalUmum/InfoJurnalUmum";
import CreateJurnalUmum from "./CreateJurnalUmum/CreateJurnalUmum";

export default function JurnalUmum() {
  const tabs = [
    { label: "Info", content: <InfoJurnalUmum /> },
    { label: "Create Company", content: <CreateJurnalUmum /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
