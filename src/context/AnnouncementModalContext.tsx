import React, { useState } from 'react';

export const AnnouncementModalContext = React.createContext([
  undefined,
  undefined,
]);

export const AnnouncementModalProvider = ({ children }) => {
  const state = useState(false);
  return (
    <AnnouncementModalContext.Provider value={state}>
      {children}
    </AnnouncementModalContext.Provider>
  );
};

export const useAnnouncementModalContext = () =>
  React.useContext(AnnouncementModalContext);
