import React from "react";
import Modal from "../Modal";
import BidElement from "../../BidElement";

const ModalForBidElement = ({ packageData, setIsOpen, isOpen }) => {
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <BidElement propsData={packageData} />
      </Modal>
    </div>
  );
};

export default ModalForBidElement;
