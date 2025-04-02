import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoUser from "./InfoUser/InfoUser";
import CreateUser from "./CreateUser/CreateUser";

export default function User() {
  const tabs = [
    { label: "Info", content: <InfoUser /> },
    { label: "Create User", content: <CreateUser /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
}
