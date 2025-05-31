import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Bride() {
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const docRef = doc(db, 'bride', 'data');

  useEffect(() => {
    // Load data from Firestore
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNotes(data.notes || '');
        setTasks(data.tasks || []);
      }
    };
    fetchData();
  }, []);

  const saveData = async (updatedNotes = notes, updatedTasks = tasks) => {
    await setDoc(docRef, {
      notes: updatedNotes,
      tasks: updatedTasks,
    });
  };

  const handleNotesChange = (e) => {
    const updatedNotes = e.target.value;
    setNotes(updatedNotes);
    saveData(updatedNotes, tasks);
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedTasks = [...tasks, { text: newTask, done: false }];
    setTasks(updatedTasks);
    saveData(notes, updatedTasks);
    setNewTask('');
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
    saveData(notes, updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveData(notes, updatedTasks);
  };

  return (
    <div className="bride-page">
      <h2>Bride's Notes</h2>
      <textarea
        className="notes-textarea"
        placeholder="Write duties, notes here..."
        value={notes}
        onChange={handleNotesChange}
      />

      <h3>Checklist</h3>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className='add-column-btn' onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={task.done ? 'done' : ''}
            onClick={() => toggleTask(index)}
          >
            <span>{task.text}</span>
            <button
            className='add-column-btn'
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(index);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
