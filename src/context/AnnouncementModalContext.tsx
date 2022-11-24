import React, { useState } from 'react';

export const AnnouncementModalContext = React.createContext([
  undefined,
  undefined,
]);

type AnnouncementModalContext = {
  visible: boolean;
  visibleAnnouncementUid: null | string;
};

export const AnnouncementModalProvider = ({ children }) => {
  const state = useState<AnnouncementModalContext>({
    visible: false,
    visibleAnnouncementUid: null,
  });
  return (
    <AnnouncementModalContext.Provider value={state}>
      {children}
    </AnnouncementModalContext.Provider>
  );
};

export const useAnnouncementModalContext = () =>
  React.useContext(AnnouncementModalContext);
