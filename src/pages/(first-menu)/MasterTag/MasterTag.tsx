// app/objek-hukum/page.tsx (atau sesuai path kamu)
"use client";

import TabPage from "@/component/tabPage/tabPage";
import React, { useRef, useState } from "react";
import InfoMasterTag from "./page/InfoMasterTag/InfoMasterTag";

const MasterTag = () => {
  const tabs = [{ label: "Info", content: <InfoMasterTag /> }];
  return (
    <>
      <TabPage tabs={tabs} page="sub" />
    </>
  );
};

export default MasterTag;
