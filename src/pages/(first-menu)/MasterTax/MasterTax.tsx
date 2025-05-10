// app/objek-hukum/page.tsx (atau sesuai path kamu)
"use client";

import TabPage from "@/component/tabPage/tabPage";
import React, { useRef, useState } from "react";
import InfoMasterTax from "./page/InfoMasterTax/InfoMasterTax";

const MasterTax = () => {
  const tabs = [{ label: "Info", content: <InfoMasterTax /> }];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
};

export default MasterTax;
