import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalUmum from "./InfoJurnalUmum/InfoJurnalUmum";
import CreateJurnalUmum from "./CreateJurnalUmum/CreateJurnalUmum";
import EditJurnalUmum from "./EditJurnalUmum/EditJurnalUmum";

export default function JurnalUmum() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  const handleAddEditTab = (id: string) => {
    const label = `Edit Jurnal Umum`;
    const isExist = dynamicTabs.find((tab) => tab.label === label);

    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: (
            <EditJurnalUmum id={id} onClose={() => handleRemoveTab(label)} />
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
    { label: "Info", content: <InfoJurnalUmum onEdit={handleAddEditTab} /> },
    { label: "Create Jurnal Umum", content: <CreateJurnalUmum /> },
  ];
  const allTabs = [...tabs, ...dynamicTabs];
  return (
    <>
      <TabPage tabs={allTabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
}
