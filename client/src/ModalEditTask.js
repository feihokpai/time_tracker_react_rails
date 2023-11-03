import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ModalEditTask(props){
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing task '"+props.task.name+"'"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {"You can edit the time you started and finished the task"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );  
}

export default ModalEditTask;
