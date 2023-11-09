import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import requestServer from './request_server';
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

function ModalEditTaskDetails(props){
  const { task } = props;
  const [fields, setFields] = useState({ name: "", description: "" });
  const [validated, setValidated] = useState(false);

  useEffect(setValuesToForm, [task]);

  function setValuesToForm(){
    if(task === null){
      setFields({ name: "", description: "" });
    }else{
      setFields({ name: task.name, description: task.description });
    }
  }

  function onChangeFields(event){
    const { name, value } = event.target;
    const fieldsCopy = { ...fields };
    fieldsCopy[name] = value;
    console.log("fieldsCopy: "+JSON.stringify(fieldsCopy));
    setFields(fieldsCopy);
  }

  function onSave(event){
    setValidated(true);
    if(event.currentTarget.checkValidity()){
      requestServer("POST", "tasks/"+task.id+"/update", fields, (json) => onClose(), (err) => handleError(err) );
    }
    avoidSubmit(event);
  }

  function onClose(){
    setFields({ name: "", description: "" });
    setValidated(false);
    props.onClose();
  }

  function handleError(error){
    console.log("Error on server: "+JSON.stringify(error));
  }

  function avoidSubmit(event){
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Modal show={props.show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing details from task '"+props.task.name+"'"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          props.show === true &&
          <Form noValidate onSubmit={onSave} validated={validated}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Name:" className="floating-label">
                <Form.Control type="text" name="name" required value={fields.name} onChange={onChangeFields}/>
                <Form.Control.Feedback type="invalid">A name is required</Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Description:" className="floating-label">
                <Form.Control as="textarea" name="description" style={{ height: '130px' }} value={fields.description} onChange={onChangeFields}/>
              </FloatingLabel>              
            </Form.Group>
            <Button type="submit">
              Save Changes
            </Button>
          </Form>
        }
      </Modal.Body>
    </Modal>
  );
}

export default ModalEditTaskDetails;
