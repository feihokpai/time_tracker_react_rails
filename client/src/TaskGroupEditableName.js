import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import './css/TaskGroupEditableName.css';
import requestServer from "./request_server";

function TaskGroupEditableName(props){
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [validated, setValidated] = useState(false);
  const [customValidationPassed, setCustomValidationPassed] = useState(null);

  useEffect( () => {
    if(!props.editionEnabled){
      cancelEditing();
    }else{
      resetNewName();
    }
  }, [props.editionEnabled]);

  function onChangeName(event){
    setNewName(event.target.value);
  }

  function cancelEditing(){
    resetNewName();
    setIsEditing(false);
    setValidated(false);
    setCustomValidationPassed(null);
  }

  function resetNewName(){
    props.taskGroup.id == 0 ? setNewName("") : setNewName(props.taskGroup.name);
  }

  function onClickName(){
    setIsEditing(true);
    props.onClickName();
  }

  function labelNameClass(){
    return (props.editionEnabled && isEditing) ? "invisible" : "visible";
  }

  function editableNameClasses(){
    let classes = "divEditableName ";
    classes += (props.editionEnabled && isEditing) ? "visible" : "invisible";
    return classes;
  }

  function saveNewName(event){
    setValidated(true);
    if(isNewNameValidated()){
      const parameters = { name: newName };
      requestSavingToServer(parameters);
      
    }else{
      console.log("Validation failed");
    }
    avoidSubmit(event);
  }

  function requestSavingToServer(parameters){
    if(props.taskGroup.id != 0){
      requestServer("POST", "task_groups/"+props.taskGroup.id+"/update", parameters, (json) => afterSave(json), (err) => props.handleError(err) );
    }else{
      requestServer("POST", "task_groups/create", parameters, (json) => afterSave(json), (err) => props.handleError(err) );
    }
  }

  function afterSave(json){
    if(json && json.status === 200){
      cancelEditing();
    }
    props.afterSave(json);
  }

  function isNewNameValidated(){
    if (newName.length >= 3) {
      const firstChar = newName.charAt(0);
      const startsWithLetter = /^[a-zA-Z]/.test(firstChar);
      if (startsWithLetter) {
        setCustomValidationPassed(true);
        return true;
      }
    }
    setCustomValidationPassed(false);
    return false;
  }

  function avoidSubmit(event){
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <>
      <Container className={labelNameClass()}><span onClick={ onClickName } title="click to edit" className="pointer-icon">{props.taskGroup.name}</span></Container>
      <Container className={editableNameClasses()}>
        <Form onSubmit={saveNewName} validated={validated}>
          <Row>
            <Col>              
              <Form.Group >                      
                <Form.Control type="text" name="task_group_name" isInvalid={ customValidationPassed === false } required value={newName} onChange={onChangeName}/>
                <Form.Control.Feedback type="invalid">A name starting with a letter with 3+ characters is required</Form.Control.Feedback>                      
              </Form.Group>              
            </Col>
            <Col xs={1}>
              <div><i onClick={cancelEditing} className="bi bi-x-square pointer-icon"  title="cancel editing"></i></div>
            </Col>
            <Col xs={1}>
              <div><i className="bi bi-check-square pointer-icon" onClick={saveNewName} title="confirm editing"></i></div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default TaskGroupEditableName;
