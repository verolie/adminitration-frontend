import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertBox } from '@/component/alertBox/alertBox';

type AlertType = "success" | "error" | "info";

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: AlertType;
  } | null>(null);

  const showAlert = (message: string, type: AlertType) => {
    setAlertMessage({ message, type });
  };

  const hideAlert = () => {
    setAlertMessage(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertMessage && (
        <AlertBox
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
}; 