import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ModalEditTask(props){
  const { task } = props;
  const [validated, setValidated] = useState(false);
  const [formObject, setFormObject] = useState({ startTimeHour: "", startTimeDate: "", finishTimeHour: "", finishTimeDate: "" });
  const [formValidated, setformValidated] = useState({ finishTimeHour: null, finishTimeDate: null });
  const hourFormatRegex = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$";

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
    if(task.finish_time != null){
      formCopy['finishTimeDate'] = task.finish_time.slice(0,10);
      formCopy['finishTimeHour'] = task.finish_time.slice(11, 16);
    }
    setFormObject(formCopy);
  }

  function onSave(event){
    let validation1Passed = event.currentTarget.checkValidity();
    let validation2Passed = customValidation();
    setValidated(true);

    if(validation1Passed && validation2Passed){
      const startTimeIsoString = mountIsoString(formObject.startTimeDate, formObject.startTimeHour);
      const finishTimeIsoString = mountIsoString(formObject.finishTimeDate, formObject.finishTimeHour);
      console.log("start Time to send to server: "+startTimeIsoString);
      console.log("finish Time to send to server: "+finishTimeIsoString);
    }else{
      console.log("No request will be done");
    }
    avoidSubmit(event);
  }

  function customValidation(){
    let formValidationCopy = { ...formValidated };    
    if((formObject.finishTimeDate === "" && formObject.finishTimeHour !== "")){
      formValidationCopy['finishTimeDate'] = false;
    }else if(formObject.finishTimeDate !== "" && formObject.finishTimeHour === ""){
      formValidationCopy['finishTimeHour'] = false;
    }else{
      formValidationCopy['finishTimeDate'] = formValidationCopy['finishTimeHour'] = true;
    }
    setformValidated(formValidationCopy);
    return formValidationCopy['finishTimeDate'] === true && formValidationCopy['finishTimeHour'] === true;
  }

  function avoidSubmit(event){
    event.preventDefault();
    event.stopPropagation();
  }

  function mountIsoString(dateString, hourString){
    if(dateString === "" && hourString === ""){
      return null;
    }
    const dateParts = dateString.split('-');
    const timeParts = hourString.split(':');
    const combinedDate = new Date(
      parseInt(dateParts[0]),   // Year
      parseInt(dateParts[1]) - 1, // Month (0-11)
      parseInt(dateParts[2]),   // Day
      parseInt(timeParts[0]),   // Hours
      parseInt(timeParts[1])    // Minutes
    );
    return combinedDate.toISOString();
  }

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing task '"+props.task.name+"'"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          props.task != null &&
          <Form noValidate onSubmit={onSave} validated={validated}>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Container>
                <Row>
                  <Col xs="5">
                    <Form.Control type="date" name="startTimeDate" className="inputTimer" style={{ width: '20ch' }} required
                        value={formObject.startTimeDate}
                        onChange={onChangeInputs}/>                    
                    <Form.Control.Feedback type="invalid">
                      Invalid date
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Control type="text" name="startTimeHour" className="inputTimer" style={{ width: '10ch' }} required
                        value={formObject.startTimeHour} 
                        onChange={onChangeInputs}
                        pattern={hourFormatRegex} />
                    <Form.Control.Feedback type="invalid">
                      Fill a valid hour in format XX:XX
                    </Form.Control.Feedback>
                  </Col>
                </Row>                
              </Container>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Finish Time</Form.Label>
              <Container>
                <Row>
                  <Col xs="5">
                    <Form.Control type="date" name="finishTimeDate" className="inputTimer" style={{ width: '20ch' }}
                        value={formObject.finishTimeDate}
                        onChange={onChangeInputs}
                        isInvalid={formValidated['finishTimeDate'] === false} />
                    <Form.Control.Feedback type="invalid">
                      Invalid date
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Group controlId="validationFieldfinishTimeHour">
                      <Form.Control type="text" name="finishTimeHour" className="inputTimer" style={{ width: '10ch' }} 
                          value={formObject.finishTimeHour} 
                          onChange={onChangeInputs}
                          pattern={hourFormatRegex}
                          isInvalid={formValidated['finishTimeHour'] === false} />
                      <Form.Control.Feedback type="invalid">
                        Fill a valid hour in format XX:XX
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>                
              </Container>
            </Form.Group>
            <Button type="submit">
              Save Changes
            </Button>
          </Form>
        }
      </Modal.Body>
      <Modal.Footer>        
      </Modal.Footer>
    </Modal>
  );  
}

export default ModalEditTask;
