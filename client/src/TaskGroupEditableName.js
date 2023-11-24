import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import './css/TaskGroupEditableName.css';

function TaskGroupEditableName(props){
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(null);

  function onChangeName(event){
    setNewName(event.target.value);
  }

  function cancelEditing(){
    setNewName(props.taskGroup.name);
    setIsEditing(false);
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

  return (
    <>
      <Container className={labelNameClass()}><span onClick={ onClickName }>{props.taskGroup.name}</span></Container>
      <Container className={editableNameClasses()}>
        <Row>
          <Col>
            <Form>
              <Form.Group >                      
                <Form.Control type="text" name="task_group_name" required value={newName || props.taskGroup.name} onChange={onChangeName}/>
                <Form.Control.Feedback type="invalid">A name is required</Form.Control.Feedback>                      
              </Form.Group>                        
            </Form>
          </Col>
          <Col xs={1}>
            <div><i onClick={cancelEditing} className="bi bi-x-square pointer-icon"  title="cancel editing"></i></div>
          </Col>
          <Col xs={1}>
            <div><i className="bi bi-check-square pointer-icon"  title="confirm editing"></i></div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TaskGroupEditableName;
