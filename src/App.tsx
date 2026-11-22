import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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

  const addTask = () => {
    if (input.trim() === '') return
    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      done: false
    }
    setTasks([newTask, ...tasks])
    setInput('')
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

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

  const completedCount = tasks.filter(t => t.done).length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black-50/50 to-gray-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border-slate-200/80 bg-gray-950 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-black via-black-50/50 to-gray-700 text-yellow-200 rounded-xl shadow-sm">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl text-yellow-200">Mis Tareas</CardTitle>
                  <CardDescription className="text-gray-700">
                    {completedCount} de {tasks.length} completadas
                  </CardDescription>
                </div>
              </div>

              {tasks.length > 0 && (
                <Badge variant="secondary" className="font-semibold text-yellow-200 bg-gradient-to-br from-black via-black-50/50 to-gray-700">
                  {progress}%
                </Badge>
              )}
            </div>

            {/* Barra de progreso animada */}
            {tasks.length > 0 && (
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="bg-yellow-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Formulario para agregar tarea */}
            <div className="flex gap-2 text-gray-700">
              <Input
                type="text"
                placeholder ="¿Qué necesitas hacer hoy?"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTask() }}
                className="flex-1 border-gray-700 hover:yellow-200 bg-black"
              />
              <Button onClick={addTask} className="gap-1.5 shrink-0 bg-gradient-to-br from-black via-black-50/50 to-gray-700 text-yellow-200 ">
                <Plus className="w-4 h-4 hover:gray-200" />
                Agregar
              </Button>
            </div>

            {/* Pestañas de filtro de shadcn/ui */}
            <Tabs
  value={filter}
  onValueChange={(value) => setFilter(value as FilterType)}
  className="w-full"
>
  <TabsList className="grid w-full grid-cols-3 bg-gradient-to-br from-black via-zinc-900/50 to-gray-700">
    <TabsTrigger
      value="all"
      className="text-yellow-200/70 hover:text-yellow-200 data-[state=active]:text-yellow-500 data-[state=active]:bg-gray-700"
    >
      Todas ({tasks.length})
    </TabsTrigger>
    <TabsTrigger
      value="pending"
      className="text-yellow-200/70 hover:text-yellow-200 data-[state=active]:text-yellow-500 data-[state=active]:bg-gray-700"
    >
      Pendientes ({tasks.filter(t => !t.done).length})
    </TabsTrigger>
    <TabsTrigger
      value="completed"
      className="text-yellow-200/70 hover:text-yellow-200 data-[state=active]:text-yellow-500 data-[state=active]:bg-gray-700"
    >
      Hechas ({completedCount})
    </TabsTrigger>
  </TabsList>
</Tabs>

            {/* Lista de tareas con animaciones de Framer Motion */}
            <ul className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-yellow-200">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.li
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-700 text-yellow-200 text-center py-10 border border-dashed rounded-lg"
                  >
                    {tasks.length === 0
                      ? 'No hay tareas aún. ¡Agrega la primera!'
                      : 'No hay tareas en esta categoría.'}
                  </motion.li>
                ) : (
                  filteredTasks.map(task => (
                    <motion.li
                      layout
                      key={task.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors group text-yellow-200 ${
                        task.done
                          ? 'bg-gray-700 border-border/50 text-yellow-200'
                          : 'bg-gradient-to-br from-black via-black-50/50 to-gray-700 border-border hover:border-primary/40 shadow-2xs text-yellow-200'
                      }`}
                    >
                      {editingId === task.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <Input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEdit(task.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="h-8 text-sm flex-1"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEdit(task.id)}
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="h-8 w-8 text-yellow-foreground"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Checkbox
                              checked={task.done}
                              onCheckedChange={() => toggleTask(task.id)}
                              id={`task-${task.id}`}
                            />
                            <label
                              htmlFor={`task-${task.id}`}
                              onDoubleClick={(e) => {
                                e.preventDefault()
                                startEdit(task)
                              }}
                              className={`text-yellow-200 truncate select-none cursor-pointer transition-all ${
                                task.done
                                  ? 'line-through text-muted-foreground'
                                  : 'text-foreground font-medium'
                              }`}
                              title="Clic para completar / Doble clic para editar"
                            >
                              {task.text}
                            </label>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEdit(task)}
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              title="Editar tarea"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeTask(task.id)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Eliminar tarea"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default App