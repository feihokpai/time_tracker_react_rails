import { useState, useEffect } from "react";

function TasksPage(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(getTasks, []);

  return (
    <div>
      <h1>React App</h1>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h2>Data from Rails Backend:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
