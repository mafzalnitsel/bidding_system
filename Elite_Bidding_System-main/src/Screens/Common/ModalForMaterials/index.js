import React from "react";
import Modal from "../Modal";
import MeterialPackages from "../../MeterialPackages";

const ModalForMaterials = ({ packageData, setIsOpen, isOpen }) => {
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <MeterialPackages data={packageData} />
      </Modal>
    </div>
  );
};

export default ModalForMaterials;
