import React, { Dispatch, ReactNode, SetStateAction } from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";

interface SettingsModalProps {
  closeModal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setUsername: Dispatch<SetStateAction<string>>
) => {
  setUsername(event.target.value);
};

const SettingsModal = (props: SettingsModalProps) => {
  const { closeModal, soundEnabled, setSoundEnabled, username, setUsername } =
    props;

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const SettingsNode: ReactNode = (
    <div className="modal-content-container">
      <div className="settings-container">
        <div className="settings-text">
          <b>Username</b>
        </div>
        <input
          className="settings-username-input"
          maxLength={8}
          type="text"
          placeholder="User"
          value={username}
          onChange={(event) => handleInputChange(event, setUsername)}
        />
      </div>
      <div className="settings-container">
        <div className="settings-text">
          <b>Dark Theme</b>
        </div>
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={isDark} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="settings-container">
        <div className="settings-text">
          <b>Sound Enabled</b>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            onChange={() => {
              setSoundEnabled(!soundEnabled);
            }}
            checked={soundEnabled}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="settings-container border-bottom-none">
        <div className="settings-text">
          <b>Feedback</b>
        </div>
        <a
          href="mailto:max.oberholtzer@yahoo.com?subject=LetterSwap%20Feedback"
          className="feedback-link"
        >
          Email
        </a>
      </div>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={SettingsNode}
      modalTitle="Settings"
    />
  );
};

export default SettingsModal;
