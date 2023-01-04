import React, { Dispatch, SetStateAction, useState } from 'react';

type AnnouncementModalContext = {
  visible: boolean;
  visibleAnnouncementUid?: string;
};

const AnnouncementModalContext = React.createContext([undefined, undefined] as [
  AnnouncementModalContext,
  Dispatch<SetStateAction<AnnouncementModalContext>>,
]);

export const AnnouncementModalProvider = ({ children }) => {
  const state = useState<AnnouncementModalContext>({
    visible: false,
    visibleAnnouncementUid: undefined,
  });
  return (
    <AnnouncementModalContext.Provider value={state}>
      {children}
    </AnnouncementModalContext.Provider>
  );
};

export const useAnnouncementModalContext = () =>
  React.useContext(AnnouncementModalContext);
