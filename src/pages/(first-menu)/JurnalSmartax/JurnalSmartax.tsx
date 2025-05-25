import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalSmartax from "./InfoJurnalSmartax/InfoJurnalSmartax";
import CreateJurnalSmartax from "./CreateJurnalSmartax/CreateJurnalSmartax";
import EditJurnalSmartax from "./EditJurnalSmartax/EditJurnalSmartax";
import { useAppContext } from "@/context/context";

export default function JurnalSmartax() {
  const { editTabs, addEditTab, removeEditTab } = useAppContext();
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  // Update dynamicTabs when editTabs changes
  React.useEffect(() => {
    const smartaxTabs = editTabs.filter(tab => tab.type === 'smartax');
    setDynamicTabs(smartaxTabs.map(tab => ({
      label: tab.label,
      content: <EditJurnalSmartax id={tab.id} onClose={() => removeEditTab(tab.label)} />,
      closable: true
    })));
  }, [editTabs, removeEditTab]);

  const handleAddEditTab = (id: string) => {
    addEditTab(id, 'smartax');
  };

  const handleRemoveTab = (label: string) => {
    removeEditTab(label);
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
