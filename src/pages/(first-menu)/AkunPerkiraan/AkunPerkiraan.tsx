import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoAkunPerkiraan from "./SubPage/Info/InfoAkunPerkiraan";
import CreateAkunPerkiraan from "./SubPage/DataBaruAkunPerkiraan/DataBaruAkunPerkiraan";
import EditAkunPerkiraan from "./SubPage/editAkunPerkiraan/EditAkunPerkiraan";
import { classifyKodePerkiraan } from "./function/classifyKodePerkiraan";

export default function AkunPerkiraan() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  const handleAddEditTab = (id: string, kodePerkiraan: string) => {
    const label = `Edit Info Akun`;
    const isExist = dynamicTabs.find((tab) => tab.label === label);

    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: (
            <EditAkunPerkiraan
              id={id}
              level={classifyKodePerkiraan(kodePerkiraan)}
              onClose={() => handleRemoveTab(label)}
            />
          ),
          closable: true,
        },
      ]);
    }
  };

  const handleRemoveTab = (label: string) => {
    setDynamicTabs((prev) => prev.filter((tab) => tab.label !== label));
  };
  const tabs = [
    { label: "Info", content: <InfoAkunPerkiraan onEdit={handleAddEditTab} /> },
    { label: "Create Akun Perkiraan", content: <CreateAkunPerkiraan /> },
  ];
  const allTabs = [...tabs, ...dynamicTabs];
  return (
    <>
      <TabPage tabs={allTabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
}
