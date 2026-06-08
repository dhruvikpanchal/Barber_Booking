"use client";

import { useCallback, useState } from "react";

/** `{ open, openModal, closeModal, toggleModal }` for dialog visibility. */
export function useModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const toggleModal = useCallback(() => setOpen((value) => !value), []);

  return { open, setOpen, openModal, closeModal, toggleModal };
}
