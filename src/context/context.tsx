"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IMenu } from "./data/menu";
import { ISettings } from "./data/settings";
import { IError } from "./data/error";
import { ILoading } from "./data/loading";
import { IErrorField } from "./data/errorField";
import { menuList } from "@/utils/constant/menuList";

export interface IFilter {
  field: string;
  operator: string;
  value: any;
}

interface AppContextProps {
  menu: IMenu;
  settings: ISettings;
  error: IError;
  loading: ILoading;
  sessionId: string | null;
  filters: IFilter[];
  errorField: IErrorField[];
  roles: { category: string; permissions: string[] }[];
  messageAlert: string | null;
  openAlert: boolean;
  tabs: { label: string; content: React.ReactNode }[];
  activeTabIndex: number;
  updateErrorMessage: (error: string) => void;
  updateCurrentMenu: (menu: string) => void;
  updateSettings: (settings: ISettings) => void;
  updateLoadingActive: (loading: ILoading) => void;
  updateSessionId: (id: string | null) => void;
  updateRoles: (roles: { category: string; permissions: string[] }[]) => void;
  resetRoles: () => void;
  updateFilter: (index: number, newFilter: IFilter) => void;
  addFilter: (newFilter: IFilter) => void;
  removeFilter: (index: number) => void;
  resetFilters: () => void;
  addErrorFieldMessage: (errorField: IErrorField[]) => void;
  resetErrorFieldMessage: () => void;
  showAlert: (message: string) => void;
  closeAlert: () => void;
  addTab: (label: string) => void;
  removeTab: (label: string) => void;
  handleTabChange: (index: number) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
  initialSessionId?: string | null;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
  initialSessionId = null,
}) => {
  const [menu, setMenu] = useState<IMenu>({ currentMenu: "home" });
  const [settings, setSettings] = useState<ISettings>({ darkTheme: false });
  const [error, setError] = useState<IError>({ errorMessage: "" });
  const [loading, setLoading] = useState<ILoading>({ loadingActive: false });
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const [errorField, setErrorField] = useState<IErrorField[]>([]);
  const [filters, setFilters] = useState<IFilter[]>([]);
  const [roles, setRoles] = useState<
    { category: string; permissions: string[] }[]
  >([]);
  const [messageAlert, setMessageAlert] = useState<string | null>("");
  const [openAlert, setOpenAlert] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [tabs, setTabs] = React.useState<
    { label: string; content: React.ReactNode }[]
  >([]);

  const updateErrorMessage = (error: string) => {
    setError({ errorMessage: error });
  };

  const updateCurrentMenu = (menu: string) => {
    setMenu({ currentMenu: menu });
  };

  const updateSettings = (newSettings: ISettings) => {
    setSettings(newSettings);
  };

  const updateLoadingActive = (newLoading: ILoading) => {
    setLoading(newLoading);
  };

  const updateSessionId = (id: string | null) => {
    setSessionId(id);
  };

  //update roles

  const updateRoles = (role: { category: string; permissions: string[] }[]) => {
    setRoles(role);
  };

  const resetRoles = () => {
    setRoles([]);
  };

  //Update filter

  const updateFilter = (index: number, newFilter: IFilter) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      updatedFilters[index] = newFilter;
      return updatedFilters;
    });
  };

  const addFilter = (newFilter: IFilter) => {
    setFilters((prevFilters) => [...prevFilters, newFilter]);
  };

  const removeFilter = (index: number) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    setFilters([]);
    setErrorField([]);
  };

  //Error Field Message

  const addErrorFieldMessage = (newFilter: IErrorField[]) => {
    setErrorField(newFilter);
    console.log("error field ", errorField);
  };

  const resetErrorFieldMessage = () => {
    setErrorField([]);
  };

  //Alert
  const showAlert = (message: string) => {
    setMessageAlert(message);
    setOpenAlert(true);
  };

  const closeAlert = () => {
    setMessageAlert(null);
    setOpenAlert(false);
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  //page tab
  const addTab = (label: string) => {
    console.log("test ini label ", label);

    let foundTab = menuList.find((menu) => menu.label === label);

    if (!foundTab) {
      for (const menu of menuList) {
        const foundSub = menu.submenu?.find((sub) => sub.label === label);
        if (foundSub) {
          foundTab = { ...menu, label: foundSub.label, path: foundSub.path }; // Gunakan data submenu
          break;
        }
      }
    }

    if (foundTab) {
      setTabs((prevTabs) => {
        if (prevTabs.some((tab) => tab.label === foundTab!.label)) {
          return prevTabs;
        }
        return [
          ...prevTabs,
          { label: foundTab!.label, content: foundTab!.path, closable: true },
        ];
      });
      setActiveTabIndex(tabs.length);
    }
  };

  const removeTab = (label: string) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.label !== label));
  };

  const contextValue: AppContextProps = {
    menu,
    settings,
    error,
    loading,
    sessionId,
    filters,
    errorField,
    roles,
    messageAlert,
    openAlert,
    tabs,
    activeTabIndex,
    handleTabChange,
    updateErrorMessage,
    updateCurrentMenu,
    updateSettings,
    updateLoadingActive,
    updateSessionId,
    updateRoles,
    resetRoles,
    updateFilter,
    addFilter,
    removeFilter,
    resetFilters,
    addErrorFieldMessage,
    resetErrorFieldMessage,
    showAlert,
    closeAlert,
    addTab,
    removeTab,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export default AppContext;
