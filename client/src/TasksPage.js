import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
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

  function processTasksPanel(){
    console.log("call processTaskPanel");
    return (
      <Container>
        <Row >
          <Col xs={7}>
            {data.map(processTaskGroups)}
          </Col>
          <Col></Col>
        </Row>        
      </Container>
    );
  }

  function processTaskGroups(taskGroup, index){
    console.log("call processTaskGroups");
    return (
      <Container key={index} className="mb-3" onClick={() => setSelectedTaskGroup(taskGroup.id)}>
        <Row >
          <Col className="taskGroup">
            {taskGroup.name}        
          </Col>
        </Row>
        {taskGroup.id === selectedTaskGroup && taskGroup.tasks.map(processTask)}
      </Container>
    );
  }

  function processTask(task, index){
    console.log("call processTask");
    return (
      <Row className="rowTask" key={index} title={task.description}>
        <Col xs={8}>{task.name}</Col>        
        <Col className="taskButtons" xs={4}>
          <Container className="taskButton">
            <Button>Start</Button>
          </Container>
          <Container className="taskButton">
            <Button>Edit</Button>
          </Container>
        </Col>
        <Col></Col>
      </Row>
    );
  }

  function startTimer(idTask){
    console.log("Start timer from task "+idTask);
  }

  return (
    <div>
      <h1>React App</h1>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h2>Tasks</h2>
          {processTasksPanel()}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
