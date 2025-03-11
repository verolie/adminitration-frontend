'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IMenu } from './data/menu';
import { ISettings } from './data/settings';
import { IError } from './data/error';
import { ILoading } from './data/loading';
import { IErrorField } from './data/errorField';

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
  const [menu, setMenu] = useState<IMenu>({ currentMenu: 'home' });
  const [settings, setSettings] = useState<ISettings>({ darkTheme: false });
  const [error, setError] = useState<IError>({ errorMessage: '' });
  const [loading, setLoading] = useState<ILoading>({ loadingActive: false });
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const [errorField, setErrorField] = useState<IErrorField[]>([]);
  const [filters, setFilters] = useState<IFilter[]>([]);
  const [roles, setRoles] = useState<
    { category: string; permissions: string[] }[]
  >([]);
  const [messageAlert, setMessageAlert] = useState<string | null>('');
  const [openAlert, setOpenAlert] = useState(false);

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

  const updateRoles = (role: { category: string; permissions: string[] }[]) => {
    setRoles(role);
  };

  const resetRoles = () => {
    setRoles([]);
  };

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

  const addErrorFieldMessage = (newFilter: IErrorField[]) => {
    setErrorField(newFilter);
    console.log('error field ', errorField);
  };

  const resetErrorFieldMessage = () => {
    setErrorField([]);
  };

  const showAlert = (message: string) => {
    setMessageAlert(message);
    setOpenAlert(true);
  };

  const closeAlert = () => {
    setMessageAlert(null);
    setOpenAlert(false);
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
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
