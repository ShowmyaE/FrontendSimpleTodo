import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    
    const [save, saveText] = useState(true);

    const fetchTasks = async () => {
        const res = await axios.get('https://backendsimpletodo.onrender.com/tasks');
        setTasks(res.data);
    };

    const addTask = async () => {
        const res = await axios.post('https://backendsimpletodo.onrender.com/tasks', { name: taskTitle });
        setTasks([...tasks, res.data]);
        setTaskTitle('');
    };

    const toggleTask = async (id, data, saveButton) => {
        const res = await axios.put(`https://backendsimpletodo.onrender.com/tasks/${id}`, data);
        saveText(saveButton)
        setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    };

    const deleteTask = async (id) => {
        await axios.delete(`https://backendsimpletodo.onrender.com/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <textarea rows='2' cols='30'  value={task.name}  disabled={save}
                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                           
                        >
                            {task.name}
                            {/* {task.category}
                            {task.priority} */}
                        </textarea>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                        {!task.completed && <button onClick={() => toggleTask(task._id, { completed: !task.completed })}>Complete</button>}
                        {(!task.completed && save) ? <button onClick={() => toggleTask(task._id, {name: task.name}, !save)}>Edit</button> : 
                              <button onClick={() => toggleTask(task._id, {name: task.name}, !save)}>Save</button> }
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;