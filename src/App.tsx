import { useState, useEffect } from 'react'
import type { Task } from './types'

type FilterType = 'all' | 'pending' | 'completed'

function App() {
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Función para agregar una nueva tarea
  const addTask = () => {
    if (input.trim() === '') return
    const newTask: Task = {
      id: Date.now(),
      text: input,
      done: false
    }
    setTasks([newTask, ...tasks])
    setInput('')
  }

  // Función para marcar/desmarcar una tarea como completada
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  // Función para eliminar una tarea
  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const saveEdit = (id: number) => {
    if (editText.trim() === '') return
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ))
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.done
    if (filter === 'completed') return task.done
    return true
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          To-Do
        </h2>
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          List
        </h2>

        <div className="flex mb-4">
          <input
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Nueva tarea..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask() }}
          />
          <button
            className="bg-blue-500 text-blue px-4 py-2 rounded-r-lg hover:bg-red-600 transition-colors"
            onClick={addTask}
          >
            Agregar
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-4 text-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-red-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-red-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendientes ({tasks.filter(t => !t.done).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-red-200 text-gray-700 hover:bg-blue-300'
            }`}
          >
            Completadas ({tasks.filter(t => t.done).length})
          </button>
        </div>

        <ul>
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between py-2 border-b last:border-b-0 group gap-2"
            >

              {editingId === task.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(task.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className="flex-1 border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                    title="Guardar"
                  >
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                    title="Cancelar"
                  >
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer select-none transition ${
                      task.done ? 'line-through text-gray-400' : ''
                    }`}
                    onClick={() => toggleTask(task.id)}
                    onDoubleClick={() => startEdit(task)}
                    title="Clic para completar / Doble clic para editar"
                  >
                    {task.text}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      title="Editar tarea"
                    >
                      EDITAR
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Eliminar tarea"
                    >
                      ELIMINAR
                    </button>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      title="Editar tarea"
                    >
                      COMPLETAR
                    </button>

                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App