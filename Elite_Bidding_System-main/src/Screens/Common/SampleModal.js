import React, { useState } from "react";
import Modal from "./Modal";

const SampleModal = () => {
  const [isOpen, setIsOpen] = useState();
  return (
    <div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"Let's check"}
      >
        <div>
            <h2>This is Sample Modal</h2>
            <p>This is content</p>
        </div>
      </Modal>

    <button onClick={()=> setIsOpen(true)}>
        Open Modal
    </button>
    </div>
  );
};

export default SampleModal;
