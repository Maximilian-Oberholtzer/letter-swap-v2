import React from "react";
import "./modal.css";
import { useTheme } from "../../../theme/Theme";

interface ModalProps {
  closeModal: () => void;
  modalContent: React.ReactNode;
  modalTitle: string;
}

const Modal = (props: ModalProps) => {
  const { closeModal, modalContent, modalTitle } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //handle close - fade out
  const handleClose = () => {
    const modalElement = document.querySelector(".modal-content");
    modalElement?.classList.add("modal-fade-out");
    setTimeout(() => {
      closeModal();
    }, 170);
  };

  return (
    <div className="modal" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          backgroundColor: isDark
            ? "var(--dark-background)"
            : "var(--light-background)",
          color: isDark ? "var(--dark-text)" : "var(--light-text)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-title-container">
          <header className="modal-title">{modalTitle}</header>
          <button className="modal-close-button" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {modalContent}
      </div>
    </div>
  );
};

export default Modal;
