import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: clamp(200px, 70vw, 500px);
  gap: 1rem;
  color: var(--text-color);
`;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>How to use this postcode tool</h2>
        <p>
          Enter any postcodes you wish to map into the input box in the following format
        </p>
        <p>"POSTCODE,POSTCODE,POSTCODE"</p>
        <p>The app will not work if you put spaces between the postcodes and the comma</p>
        <p>
          You can then select the color by clicking the color picker box, and the opacity by adjusting the slider. 
        </p>
        <p>
         To see the updated styles, please click update map again
        </p>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;