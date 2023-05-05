import React, { ReactNode } from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";

const year = new Date().getFullYear();

interface SupportModalProps {
  closeModal: () => void;
}

const SupportModal = (props: SupportModalProps) => {
  const { closeModal } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const SupportNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text text-align-center">
        Thank you for playing my game! Just trying it out is all the support I
        could ask for. However, I do like beer. So if you would like to further
        support me, <b>YOU CAN:</b>
      </p>
      <div className="support-link-container">
        <a
          style={{
            backgroundColor: isDark
              ? "var(--dark-tile-color)"
              : "var(--light-tile-color)",
          }}
          href="https://www.buymeacoffee.com/maxoberholtzer"
          target="_blank"
          rel="noreferrer"
          className={`support-link ${
            isDark ? "support-link-dark" : "support-link-light"
          }`}
        >
          Buy me a Beer! 🍺
        </a>
      </div>

      <p className="modal-text text-align-center">
        © {year} Maximilian Oberholtzer
      </p>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={SupportNode}
      modalTitle="Support"
    />
  );
};

export default SupportModal;
