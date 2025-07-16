// app/objek-hukum/page.tsx (atau sesuai path kamu)
"use client";

import TabPage from "@/component/tabPage/tabPage";
import React, { useRef, useState } from "react";
import InfoObjekHukum from "./page/InfoOkbjekHukum/InfoObjekHukum";
import EditObjekHukum from "./page/editObjekHukum/editObjekHukum";

const ObjekPajak = () => {
  const tabs = [
    { label: "Info", content: <InfoObjekHukum /> },
    { label: "Edit Objek Pajak", content: <EditObjekHukum /> },
  ];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
};

export default ObjekPajak;
