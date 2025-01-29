import React, { createContext, useState, useContext, useMemo } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [openModal, setOpenModal] = useState(null);

  const open = (modalName) => setOpenModal(modalName);
  const close = () => setOpenModal(null);
  const isOpen = (modalName) => openModal === modalName;
  const value = useMemo(() => ({ open, close, isOpen }), [openModal]);

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
