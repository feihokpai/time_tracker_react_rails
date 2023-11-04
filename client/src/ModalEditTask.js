import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ModalEditTask(props){
  const { task } = props;
  const [formObject, setFormObject] = useState({ startTimeHour: "", startTimeDate: "", finishTimeHour: null, finishTimeDate: null });

  useEffect(setValuesToModalForm, [task]);

  function onChangeInputs(event){    
    const { name, value } = event.target;
    const formCopy = { ...formObject };
    formCopy[name] = value;
    console.log("formCopy: "+JSON.stringify(formCopy));
    setFormObject(formCopy);
  }

  function setValuesToModalForm(){
    if(task == null){
      return;
    }
    let formCopy = { ...formObject };
    formCopy['startTimeDate'] = task.start_time.slice(0,10);
    formCopy['startTimeHour'] = task.start_time.slice(11, 16);
    setFormObject(formCopy);
  }

  function onSave(event){
    
  }

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing task '"+props.task.name+"'"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          props.task != null &&
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Container>
                <Row>
                  <Col xs="4">
                    <Form.Control type="text" name="startTimeDate" className="inputTimer" style={{ width: '12ch' }} disabled
                        value={formObject.startTimeDate}
                        onChange={onChangeInputs}/>
                  </Col>
                  <Col>
                    <Form.Control type="text" name="startTimeHour" className="inputTimer" style={{ width: '8ch' }} 
                        value={formObject.startTimeHour} 
                        onChange={onChangeInputs}/>
                  </Col>
                </Row>
                
              </Container>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Finish Time</Form.Label>
              <Form.Control type="text" disabled/>              
            </Form.Group>
          </Form>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );  
}

export default ModalEditTask;
