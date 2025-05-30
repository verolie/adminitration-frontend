import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoJurnalSmartax from "./InfoJurnalSmartax/InfoJurnalSmartax";
import CreateJurnalSmartax from "./CreateJurnalSmartax/CreateJurnalSmartax";
import EditJurnalSmartax from "./EditJurnalSmartax/EditJurnalSmartax";
import { useAppContext } from "@/context/context";

export default function JurnalSmartax() {
  const { editTabs, addEditTab, removeEditTab, handleTabChange } = useAppContext();
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

  // Handler edit: tutup tab edit smartax lain, buka tab baru, fokus ke tab edit baru
  const handleAddEditTab = (id: string) => {
    // Tutup semua tab edit smartax yang id-nya beda
    editTabs.filter(tab => tab.type === 'smartax' && tab.id !== id)
      .forEach(tab => removeEditTab(tab.label));
    // Tambahkan tab edit baru jika belum ada
    if (!editTabs.find(tab => tab.type === 'smartax' && tab.id === id)) {
      addEditTab(id, 'smartax');
    }
    // Fokus ke tab edit smartax yang baru
    setTimeout(() => {
      // Cari index tab edit smartax yang baru
      const allTabs = [
        { label: "Info" },
        { label: "Create Jurnal Smartax" },
        ...editTabs.filter(tab => tab.type === 'smartax').map(tab => ({ label: tab.label }))
      ];
      const idx = allTabs.findIndex(tab => tab.label === id);
      if (idx !== -1) handleTabChange(idx);
    }, 0);
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
