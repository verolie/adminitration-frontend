// app/objek-hukum/page.tsx (atau sesuai path kamu)
"use client";

import TabPage from "@/component/tabPage/tabPage";
import React, { useRef, useState } from "react";
import InfoMasterTax from "./page/InfoMasterTax/InfoMasterTax";
import ModifyMasterTax from "./page/ModifyMasterTax/ModifyMasterTax";
const MasterTax = () => {
  const tabs = [{ label: "Info", content: <InfoMasterTax /> },
    { label: "Modify Master Tax", content: <ModifyMasterTax onClose={() => {}} /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
};

export default MasterTax;
