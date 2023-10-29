import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './css/TasksPage.css'

function TasksPage(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);

  useEffect(getTasks, []);

  function getTasks(){
    const apiUrl = 'http://localhost:3000/task_groups/';
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();        
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((err) => {
        setError(err);
      });
  }

  function processTaskGroups(taskGroup, index){
    console.log("call processTaskGroups");
    return (
      <Container key={index} onMouseOver={() => setSelectedTaskGroup(taskGroup.id)}>
        <Row >
          <Col className="taskGroup" xs={6}>
            {taskGroup.name}        
          </Col>
          <Col></Col>
        </Row>
        {taskGroup.id === selectedTaskGroup && taskGroup.tasks.map(processTask)}
      </Container>
    );
  }

  function processTask(task, index){
    console.log("call processTask");
    return (
      <Row key={index} title={task.description}>
        <Col className="rowTask" xs={6}>{task.name}</Col>        
        <Col></Col>
      </Row>
    );
  }

  return (
    <div>
      <h1>React App</h1>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h2>Tasks</h2>
          <ul>
            {data.map(processTaskGroups)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
