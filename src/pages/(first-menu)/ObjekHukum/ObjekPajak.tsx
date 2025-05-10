// app/objek-hukum/page.tsx (atau sesuai path kamu)
"use client";

import TabPage from "@/component/tabPage/tabPage";
import React, { useRef, useState } from "react";
import InfoObjekHukum from "./page/InfoOkbjekHukum/InfoObjekHukum";

const MasterTax = () => {
  const tabs = [{ label: "Info", content: <InfoObjekHukum /> }];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
};

export default MasterTax;
