import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TasksPage from './TasksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
