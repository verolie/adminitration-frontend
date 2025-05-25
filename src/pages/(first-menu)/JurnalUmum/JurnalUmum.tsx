import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalUmum from "./InfoJurnalUmum/InfoJurnalUmum";
import CreateJurnalUmum from "./CreateJurnalUmum/CreateJurnalUmum";
import EditJurnalUmum from "./EditJurnalUmum/EditJurnalUmum";
import { useAppContext } from "@/context/context";

export default function JurnalUmum() {
  const { handleTabChange, editTabs, addEditTab, removeEditTab, addTab } = useAppContext();
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  // Update dynamicTabs when editTabs changes
  React.useEffect(() => {
    const umumTabs = editTabs.filter(tab => tab.type === 'umum');
    setDynamicTabs(umumTabs.map(tab => ({
      label: tab.label,
      content: <EditJurnalUmum id={tab.id} onClose={() => removeEditTab(tab.label)} />,
      closable: true
    })));
  }, [editTabs, removeEditTab]);

  const handleAddEditTab = (id: string) => {
    addEditTab(id, 'umum');
  };

  const handleRemoveTab = (label: string) => {
    removeEditTab(label);
  };

  const handleSwitchToSmartax = (id: string) => {
    // Add main Jurnal Smartax tab
    addTab("Jurnal Smartax");
    
    // Add edit tab for Smartax
    addEditTab(id, 'smartax');
    
    // Switch to Jurnal Smartax tab
    handleTabChange(1);
  };

  const tabs = [
    { label: "Info", content: <InfoJurnalUmum onEdit={handleAddEditTab} onSwitchToSmartax={handleSwitchToSmartax} /> },
    { label: "Create Jurnal Umum", content: <CreateJurnalUmum /> },
  ];
  const allTabs = [...tabs, ...dynamicTabs];
  return (
    <>
      <TabPage tabs={allTabs} page="sub" onRemoveTab={handleRemoveTab} />
    </>
  );
}
