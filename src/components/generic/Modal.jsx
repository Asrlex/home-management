import { createPortal } from 'react-dom';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { MdClose } from 'react-icons/md';

const Modal = forwardRef(({ children }, ref) => {
  const dialog = useRef();
  useImperativeHandle(ref, () => ({
    open: () => {
      dialog.current.showModal();
    },
    close: () => {
      dialog.current.close();
    }
  }));

  return createPortal(
    <dialog
      ref={dialog}
      className='modal'
      autoFocus={false}
    >
      <button
        onClick={() => dialog.current.close()}
        className='modalCerrar'
      >
        <MdClose />
      </button>
      {children}
    </dialog>
    , document.getElementById('modal-root'));
});

export default Modal;