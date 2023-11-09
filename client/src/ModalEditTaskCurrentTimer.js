import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import requestServer from './request_server';

function ModalEditTaskCurrentTimer(props){
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
    let startDateTime = new Date(task.start_time);
    formCopy['startTimeDate'] = extractLocaleDate(startDateTime);
    formCopy['startTimeHour'] = extractLocaleHour(startDateTime);
    if(task.finish_time != null){
      let finishDateTime = new Date(task.finish_time);
      formCopy['finishTimeDate'] = extractLocaleDate(finishDateTime);
      formCopy['finishTimeHour'] = extractLocaleHour(finishDateTime);
    }else{
      formCopy['finishTimeDate'] = formCopy['finishTimeHour'] = "";      
    }
    setFormObject(formCopy);
    setValidated(false);
    setformValidated({ finishTimeHour: null, finishTimeDate: null });
  }

  function extractLocaleDate(date){
    return date.getFullYear()+"-"+addZero(date.getMonth() + 1)+"-"+addZero(date.getDate())
  }

  function addZero(number){
    return number.toString().padStart(2, '0');
  }

  function extractLocaleHour(date){
    return addZero(date.getHours())+":"+addZero(date.getMinutes());
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
      const parameters = { start_time: startTimeIsoString, finish_time: finishTimeIsoString };
      requestServer("POST", "timers/"+task.active_timer_id+"/update", parameters, (json) => onClose(), (err) => handleError(err) );
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

  function onClose(){
    let formCopy = { ...formObject };
    formCopy['finishTimeDate'] = formCopy['finishTimeHour'] = "";      
    setFormObject(formCopy);
    setValidated(false);
    setformValidated({ finishTimeHour: null, finishTimeDate: null });
    props.onClose();
  }

  function handleError(error){

  }

  return (
    <Modal show={props.show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ props.task != null && "Editing timer from task '"+props.task.name+"'"}</Modal.Title>
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

export default ModalEditTaskCurrentTimer;
