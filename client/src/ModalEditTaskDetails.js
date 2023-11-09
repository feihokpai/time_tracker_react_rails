import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import requestServer from './request_server';

function ModalEditTaskDetails(props){
  const { task } = props;
  const [fields, setFields] = useState({ name: "", description: "" });
  const [validations, setValidations] = useState({ name: null, description: null });

  function validated(){
    const { name, description } = validations;
    if(name === null && description === null){
      return null;
    }else if(name === true && description === true){
      return true;
    }
    return false;
  }

  function onSave(){

  }

  function onClose(){
    props.onClose();
  }

  return (
    <Modal show={props.show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing details from task '"+props.task.name+"'"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          props.task != null &&
          <Form noValidate onSubmit={onSave} validated={validated}>
          </Form>
        }
      </Modal.Body>
    </Modal>
  );
}

export default ModalEditTaskDetails;
