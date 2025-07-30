import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import the react-modal library
import "./index.css"; // Import your CSS file for styling
import { Close } from "@mui/icons-material";

// Set the app element for accessibility
Modal.setAppElement("#root");

const CustomModal = ({ title, children, setIsOpen, isOpen }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [setIsOpen]);
  const handleClose = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setIsClosing(false); // Reset closing animation
      setIsOpen(false); // Close modal after animation ends
    }, 150); // Match the animation duration
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}  
      overlayClassName="generic-modal-overlay" // Add overlay class
    >
      <div className={`generic-modal ${isClosing ? "scale-down" : ""}`}>
        <div className="generic-modal-close-button">
          <span onClick={handleClose}>
            <Close />
          </span>
        </div>
        <h2 className="main-title">{title}</h2>
        <div>{children}</div>
        <button onClick={handleClose}>Close</button>
      </div>
    </Modal>
  );
};

export default CustomModal;
