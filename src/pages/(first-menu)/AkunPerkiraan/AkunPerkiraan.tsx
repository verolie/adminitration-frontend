import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoAkunPerkiraan from "./SubPage/Info/InfoAkunPerkiraan";
import CreateAkunPerkiraan from "./SubPage/DataBaruAkunPerkiraan/DataBaru";

export default function AkunPerkiraan() {
  const tabs = [
    { label: "Info", content: <InfoAkunPerkiraan /> },
    { label: "Create Akun Perkiraan", content: <CreateAkunPerkiraan /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
