import { createPortal } from 'react-dom';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { MdClose } from 'react-icons/md';
import React from 'react';

interface ModalProps {
  children: React.ReactNode;
}

interface ModalHandle {
  open: () => void;
  close: () => void;
}

const Modal = forwardRef<ModalHandle, ModalProps>(({ children }, ref) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (dialog.current) {
        dialog.current.showModal();
      }
    },
    close: () => {
      if (dialog.current) {
        dialog.current.close();
      }
    },
  }));

  return createPortal(
    <dialog ref={dialog} className="modal" autoFocus={false}>
      <button onClick={() => dialog.current.close()} className="modalCerrar">
        <MdClose />
      </button>
      {children}
    </dialog>,
    document.getElementById('modal-root')
  );
});

Modal.displayName = 'Modal';

export default Modal;
