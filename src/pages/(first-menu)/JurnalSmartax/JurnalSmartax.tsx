import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalSmartax from "./InfoJurnalSmartax/InfoJurnalSmartax";
import CreateJurnalSmartax from "./CreateJurnalSmartax/CreateJurnalSmartax";
import EditJurnalSmartax from "./EditJurnalSmartax/EditJurnalSmartax";

export default function JurnalSmartax() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  const handleAddEditTab = (id: string) => {
    const label = `Edit Jurnal Smartax`;
    const isExist = dynamicTabs.find((tab) => tab.label === label);

    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: (
            <EditJurnalSmartax id={id} onClose={() => handleRemoveTab(label)} />
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
    { label: "Info", content: <InfoJurnalSmartax onEdit={handleAddEditTab} /> },
    { label: "Create Jurnal Smartax", content: <CreateJurnalSmartax /> },
  ];
  const allTabs = [...tabs, ...dynamicTabs];
  return (
    <>
      <TabPage tabs={allTabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
}
