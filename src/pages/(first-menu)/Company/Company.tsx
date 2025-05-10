import TabPage from "@/component/tabPage/tabPage";
import * as React from "react";
import InfoCompany from "./InfoCompany/InfoCompany";
import CreateCompany from "./CreateCompany/CreateCompany";
import EditCompany from "./EditCompany/EditCompany";

export default function Company() {
  const [dynamicTabs, setDynamicTabs] = React.useState<
    { label: string; content: React.ReactNode; closable: boolean }[]
  >([]);

  const handleAddEditTab = (companyId: string) => {
    const label = `Edit Company`;
    const isExist = dynamicTabs.find((tab) => tab.label === label);

    if (!isExist) {
      setDynamicTabs((prev) => [
        ...prev,
        {
          label,
          content: (
            <EditCompany
              companyId={companyId}
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

  const staticTabs = [
    { label: "Info", content: <InfoCompany /> }
  ];

  const allTabs = [...staticTabs, ...dynamicTabs];

  return <TabPage tabs={allTabs} page="sub" onRemoveTab={handleRemoveTab} />;
}
