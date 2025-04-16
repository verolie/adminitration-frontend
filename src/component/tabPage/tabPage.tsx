import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style/tabPage.module.css";

interface TabItem {
  label: string;
  content: React.ReactNode;
  closable?: boolean; // default: false
}

interface TabPageProps {
  tabs: TabItem[];
  page: "main" | "sub";
  onRemoveTab?: (label: string) => void; // Callback untuk hapus tab
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }} className={styles.tabPanel}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function TabPage({ tabs, page, onRemoveTab }: TabPageProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = (index: number) => {
    const labelToRemove = tabs[index].label;
    onRemoveTab?.(labelToRemove);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dynamic tabs"
          sx={{
            "& .MuiTabs-indicator": {
              height: "0px !important",
              borderBottom: "none !important",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              className={`${styles.tabBackround} ${
                value === index ? styles.active : ""
              }`}
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {tab.label}
                  {tab.closable && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(index);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>
      <Box className={styles.boxBackground}>
        {tabs.map((tab, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {tab.content}
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
}
