import { useEffect, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

import styles from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const Modal = ({
  children,
  onClose,
  className = "",
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modal} ${className}`}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <IoClose className={styles.closeIcon} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;