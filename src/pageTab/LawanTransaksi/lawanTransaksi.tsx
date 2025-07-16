import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoLawanTransaksi from "./InfoLawanTransaksi/InfoLawanTransaksi";
import CreateLawanTransaksi from "./CreateLawanTransaksi/CreateLawanTransaksi";
import EditLawanTransaksi from "./EditLawanTransaksi/EditLawanTransaksi";

export default function LawanTransaksi() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);
  const [activeTab, setActiveTab] = React.useState("Info");

  const companyId = localStorage.getItem("companyID") || "";

  const handleAddEditTab = (lawanTransaksiId: string) => {
    const label = `Edit Lawan Transaksi ${lawanTransaksiId}`;
    const isExist = dynamicTabs.find((tab) => tab.label === label);
  
    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: (
            <EditLawanTransaksi
              lawanTransaksiId={lawanTransaksiId}
              id={Number(lawanTransaksiId)} // <-- Add this line
              onClose={() => handleRemoveTab(label)}
            />
          ),
          closable: true,
        },
      ]);
    }
    setActiveTab(label);
  };

  const handleRemoveTab = (label: string) => {
    setDynamicTabs((prev) => prev.filter((tab) => tab.label !== label));
    if (label === activeTab) setActiveTab("Info");
  };

  const handleGoToCreate = () => {
    setActiveTab("Create Lawan Transaksi");
  };

  const staticTabs = [
    {
      label: "Info",
      content: (
        <InfoLawanTransaksi
          companyId={companyId}
          onEdit={handleAddEditTab}
          onCreate={handleGoToCreate}
        />
      ),
    },
    {
      label: "Create Lawan Transaksi",
      content: (
        <CreateLawanTransaksi
          companyId={companyId}
          onSuccess={() => setActiveTab("Info")}
        />
      ),
    },
  ];
  const allTabs = [...staticTabs, ...dynamicTabs];

  return (
    <TabPage
      tabs={allTabs}
      page="sub"
      onRemoveTab={handleRemoveTab}
    //   activeTab={activeTab}
    //   onChangeTab={setActiveTab}
    />
  );
}