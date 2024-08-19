'use client';

import React from 'react';

// interfaces
export interface IAlert {
  type: string;
  text: any;
  show?: boolean | false;
}

export interface IAlertContext {
  alert: IAlert;
  hideAlert: () => void;
  showAlert: (alert: IAlert) => void;
}

export const initialState = {
  alert: { type: '', text: '', show: false },
  hideAlert: () => {},
  showAlert: () => {},
};

export const AlertContext = React.createContext<IAlertContext>(initialState);
