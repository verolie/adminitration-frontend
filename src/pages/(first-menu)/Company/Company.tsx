import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoCompany from "./InfoCompany/InfoCompany";
import CreateCompany from "./CreateCompany/CreateCompany";

export default function Company() {
  const tabs = [
    { label: "Info", content: <InfoCompany /> },
    { label: "Create Company", content: <CreateCompany /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
