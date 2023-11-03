import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Modal from 'react-bootstrap/Modal';
import './css/TasksPage.css'

function TasksPage(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect( () => { 
    getTasks();
    startInterval();
    // Clean up the interval when the component unmounts
    return () => { clearCurrentInterval(); }; 
  }, []);

  function getTasks(){
    requestServer('GET', 'http://localhost:3000/task_groups/', (jsonData) => setData(jsonData));
  }

  function requestServer(httpMethod, url, callback){
    fetch(url, { method: httpMethod, mode: "cors", })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();        
      })
      .then(callback)
      .catch((err) => {
        setError(err);
      });
  }

  function startInterval(){
    let id = setInterval( () => { setLastTime(new Date()); }, 1000);
    setIntervalId(id);
  }

  function clearCurrentInterval(){
    if(intervalId != null){
      clearInterval(intervalId);
    }
  }

  function processTasksPanel(){
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
          <Col className="taskGroup" xs={2}>
            { taskGroup.id === selectedTaskGroup && "Spent today" }
          </Col>
          <Col className="taskGroup" xs={2}>
            { taskGroup.id === selectedTaskGroup && "Commands" }
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
        <Col className="taskButtonsColumn" xs={4}>
          <Container xs={2} title="Time the user spent in the task today">
            { task.duration_today != null && "("+task.duration_today+")" }
          </Container>
          <Container xs={2}>          
            { task.start_time == null && ( <Button onClick={ () => startTimer(task.id) } title="Start timer">Start</Button> ) }
            { task.start_time != null && 
              (<Row>
                <Col xs={8}>
                  <input type="text" className="inputTimer" style={{ width: '8ch' }} readOnly title="Click to edit timer"
                      value={calculateDuration(task)}
                      onClick={ () => selectedTaskToEdit(task) } />
                </Col>
                <Col xs={4}><CloseButton title="Stop timer" onClick={ () => stopTimer(task.id) }/></Col>
               </Row>
              ) 
            }
          </Container>          
        </Col>
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
    requestServer('POST', "http://localhost:3000/tasks/"+idTask+"/start", (jsonData) => getTasks());
  }

  function stopTimer(idTask){
    requestServer('POST', "http://localhost:3000/tasks/"+idTask+"/stop", (jsonData) => getTasks());
  }

  function selectedTaskToEdit(task){
    setTaskToEdit(task);
    setShowModal(true);
  }

  function modalEditTask(){
    return (
      <Modal show={showModal} onHide={() => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>{ taskToEdit != null && "Editing task '"+taskToEdit.name+"'"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {"You can edit the time you started and finished the task"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => saveChanges() }>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function saveChanges(){
    setShowModal(false);
  }

  return (
    <div>
      <h1>React App</h1>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h2>Tasks</h2>
          {processTasksPanel()}
          {modalEditTask()}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
