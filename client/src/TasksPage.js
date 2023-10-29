import { useState, useEffect } from "react";

function TasksPage(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
      <li key={index}>{taskGroup.name}
        <ul>
          {taskGroup.tasks.map(processTask)}
        </ul>
      </li>
    );
  }

  function processTask(task, index){
    console.log("call processTask");
    return (
      <li key={index} title={task.description}>{task.name}</li>
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
