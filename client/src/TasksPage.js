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
  let intervalId = null;

  useEffect( () => { 
    getTasks();
    // Clean up the interval when the component unmounts
    return () => { clearInterval(intervalId); }; 
  }, []);

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
        intervalId = setInterval( () => { setData(jsonData) }, 1000);
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
    return (
      <Row className="rowTask" key={index} title={task.description}>
        <Col xs={8}>{task.name}</Col>        
        <Col className="taskButtons" xs={4}>
          <Container className="taskButton">
            { task.duration_today != null && "("+task.duration_today+")" }
          </Container>
          <Container className="taskButton">
          { task.start_time == null && ( <Button onClick={ () => startTimer(task.id) }>Start</Button> ) }
          { task.start_time != null && ( <input type="text" value={calculateDuration(task)} style={{ width: '9ch' }} readOnly /> ) }
          </Container>          
        </Col>
        <Col></Col>
      </Row>
    );
  }

  function calculateDuration(taskJson){
    let startTimeString = taskJson.start_time;
    let startTime = new Date(startTimeString);
    let durationInMiliseconds = new Date() - startTime;
    let durationInSeconds = parseInt(durationInMiliseconds/1000);
    let durationInMinutes = parseInt(durationInSeconds / 60);
    let durationInHours = parseInt(durationInMinutes / 60);
    let secondsPart = value_with_zero(durationInSeconds % 60);
    let minutesPart = value_with_zero(durationInMinutes % 60);
    let hoursPart = value_with_zero(durationInHours);
    return hoursPart+":"+minutesPart+":"+secondsPart;
  }

  function value_with_zero(value){
    return (value < 10) ? "0"+value : value;
  }

  function startTimer(idTask){
    const apiUrl = 'http://localhost:3000/tasks/'+idTask+"/start";
    fetch(apiUrl, { method: 'POST', mode: "cors", })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();        
      })
      .then((jsonData) => {
        getTasks();
      })
      .catch((err) => {
        setError(err);
      });
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
