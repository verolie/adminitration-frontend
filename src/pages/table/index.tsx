import * as React from "react";
import TabPage from "@/component/tabPage/tabPage";
import { Container, Button, Stack } from "@mui/material";
import OverviewPage from "../(first-menu)/OverviewPage/OverviewPage";
import DetailsPage from "../(first-menu)/DetailPage/DetailPage";
import SettingsPage from "../(first-menu)/SettingPage/SettingPage";

export default function Table() {
  const tabOptions = {
    Overview: { label: "Overview", content: <OverviewPage /> },
    Details: { label: "Details", content: <DetailsPage /> },
    Settings: { label: "Settings", content: <SettingsPage /> },
  };

  const [tabs, setTabs] = React.useState<
    { label: string; content: React.ReactNode }[]
  >([]);

  const addTab = (key: keyof typeof tabOptions) => {
    setTabs((prevTabs) => {
      // Jika tab sudah ada, jangan tambahkan lagi
      if (prevTabs.some((tab) => tab.label === tabOptions[key].label)) {
        return prevTabs;
      }
      return [...prevTabs, tabOptions[key]];
    });
  };

  const removeTab = (label: string) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.label !== label));
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => addTab("Overview")}>
          Tambah Overview
        </Button>
        <Button variant="contained" onClick={() => addTab("Details")}>
          Tambah Details
        </Button>
        <Button variant="contained" onClick={() => addTab("Settings")}>
          Tambah Settings
        </Button>
      </Stack>
      <TabPage tabs={tabs} onRemoveTab={removeTab} page="main" />
    </Container>
  );
}
