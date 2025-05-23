import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style/tabPage.module.css";
import { useAppContext } from "@/context/context";

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
  value: number;
  index: number;
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
        <Box className={styles.tabPanel}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function TabPage({ tabs, page, onRemoveTab }: TabPageProps) {
  const { activeTabIndex, handleTabChange } = useAppContext();
  const [ value, setValue ] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (page === "sub") {
      setValue(newValue);
    } else if(page === "main") {
      handleTabChange(newValue);
    }
  };

  const handleClose = (index: number) => {
    const labelToRemove = tabs[index].label;
    onRemoveTab?.(labelToRemove);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className={styles.tabsContainer}>
        <Tabs
          value={page === "sub" ? value : activeTabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dynamic tabs"
          sx={{
            minHeight: "36px",
            "& .MuiTabs-indicator": {
              height: "0px !important",
              borderBottom: "none !important",
            },
            "& .MuiTabs-scrollButtons": {
              minHeight: "36px",
              minWidth: "32px",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              className={`${styles.tabBackround} ${
                (page === "sub" ? value : activeTabIndex) === index ? styles.active : ""
              }`}
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {tab.label}
                  {tab.closable && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(index);
                      }}
                      className={styles.closeButton}
                    >
                      <CloseIcon />
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
          <CustomTabPanel 
            key={index} 
            value={page === "sub" ? value : activeTabIndex} 
            index={index}
          >
            {tab.content}
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
}

