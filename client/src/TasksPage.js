import { useState, useEffect, useRef } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import ModalEditTaskCurrentTimer from './ModalEditTaskCurrentTimer';
import ModalEditTaskDetails from './ModalEditTaskDetails'
import requestServer from "./request_server";
import './css/TasksPage.css'

function TasksPage(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);
  const [editingTaskGroup, setEditingTaskGroup] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [showModalCurrentTimer, setShowModalCurrentTimer] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const selectedTaskGroupDiv = useRef(null);
  const ERROR_SHOW_TIMEOUT = 7000;

  useEffect( () => { 
    getTasks();
    startInterval();
    // Clean up the interval when the component unmounts
    return () => { clearCurrentInterval(); }; 
  }, []);

  useEffect( () => { 
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside); 
  }, [selectedTaskGroup]);

  function handleClickOutside(event){
    let clickedOutSideDiv = (selectedTaskGroupDiv && !selectedTaskGroupDiv.current.contains(event.target));
    if (clickedOutSideDiv) {
      setEditingTaskGroup(false);
    }
  }

  function getTasks(){
    requestServer('GET', 'task_groups/', null, (json) => setData(json), (err) => handleError(err));
  }

  function handleResponse(json){
    json.status == 500 ? handleError(json) : getTasks();
  }

  function handleError(json){
    setError(json.message);
    console.log("Unexpected answer from server: "+JSON.stringify(json));
    setTimeout( () => setError(null), ERROR_SHOW_TIMEOUT);
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
    if(selectedTaskGroup == null){
      if(data[0] != null){
        setSelectedTaskGroup(data[0]);
      }
    }
    return (
      <Container>
        { //error !== null &&
          <Row >
            <Col xs={7}>
              { error !== null &&
              <p className="error-message">
                {error}
                <CloseButton onClick={ () => setError(null) } />
              </p>              
              }
            </Col>
            <Col></Col>
          </Row>        
        }
        <Row >
          <Col xs={7}>
            {data !== null && data.map(processTaskGroups)}
          </Col>
          <Col></Col>
        </Row>        
      </Container>
    );
  }

  function processTaskGroups(taskGroup, index){
    return (
      <Container key={index} className="mb-3" onClick={ () => setSelectedTaskGroup(taskGroup) } 
          ref={ taskGroupSelected(taskGroup) ? selectedTaskGroupDiv : null }>
        <Row >
          <Col className="taskGroup">
          <Container>
            <Row>
              <Col xs={1} className="column-add-task-icon" onClick={ () => openModalToCreateTask(taskGroup.id) }>
                <div><i className="bi bi-plus-circle pointer-icon" title="Create a new task"></i></div>
              </Col>
              <Col>{taskGroup.name}</Col>
            </Row>
          </Container>
            
            
          </Col>
          <Col className="taskGroup" xs={2}>
            { taskGroupSelected(taskGroup) && "Spent today" }
          </Col>
          <Col className="taskGroup" xs={2}>
            { taskGroupSelected(taskGroup) && "Commands" }
          </Col>          
        </Row>
        { taskGroupSelected(taskGroup) && taskGroup.tasks.map(processTask) }
      </Container>
    );
  }

  function taskGroupSelected(taskGroup){
    return selectedTaskGroup !== null && taskGroup.id === selectedTaskGroup.id
  }

  function openModalToCreateTask(taskGroup){
    setSelectedTaskGroup(taskGroup);
    setTaskToEdit(null);
    setShowModalDetails(true);
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
            { task.start_time == null && 
              ( 
                <Row>
                  <Col xs={8}><Button onClick={ () => startTimer(task.id) } title="Start timer">Start</Button></Col>
                  <Col xs={4}>
                    <div><i className="bi bi-pencil pointer-icon" onClick={ () => editTaskDetails(task) } title="Edit task details"></i></div>
                  </Col>
                </Row>
              ) 
            }
            { task.start_time != null && 
              (<Row>
                <Col xs={8}>
                  <input type="text" className="inputTimer" style={{ width: '8ch' }} readOnly title="Click to edit timer"
                      value={calculateDuration(task)}
                      onClick={ () => editCurrentTimer(task) } />
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
    requestServer('POST', "tasks/"+idTask+"/start", null, (jsonData) => handleResponse(jsonData), (err) => setError(err));
  }

  function stopTimer(idTask){
    requestServer('POST', "tasks/"+idTask+"/stop", null, (jsonData) => handleResponse(jsonData), (err) => setError(err));
  }

  function editCurrentTimer(task){
    setTaskToEdit(task);
    setShowModalCurrentTimer(true);
  }

  function onCloseModalCurrentTimer(){
    setShowModalCurrentTimer(false);
    getTasks();
  }

  function editTaskDetails(task){
    setTaskToEdit(task);
    setShowModalDetails(true);
  }

  function onCloseModalDetails(){
    setShowModalDetails(false);
    getTasks();
  }

  return (
    <div>
      <h1>React App</h1>
      {data && (
        <div>
          <h2>Tasks</h2>
          {processTasksPanel()}
          <ModalEditTaskCurrentTimer show={showModalCurrentTimer} task={taskToEdit}
              onClose={() => onCloseModalCurrentTimer()} />
          <ModalEditTaskDetails show={showModalDetails} 
              task={taskToEdit}
              taskGroups={data}
              taskGroupSelected={selectedTaskGroup}
              onClose={ () => onCloseModalDetails() }
              onError={ (json) => handleResponse(json) } />
        </div>
      )}
    </div>
  );
}

export default TasksPage;
