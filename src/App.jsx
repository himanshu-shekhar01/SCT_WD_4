import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid'
import { FaEdit } from "react-icons/fa"
import { AiFillDelete } from "react-icons/ai"

function App() {

  const [todo, setTodo] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(todoString)
      setTodos(todos)
    }
  }, [])

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const handleEdit = (e, id) => {
    let t = todos.find(item => item.id === id)
    if (t) {
      setTodo(t.todo)
      setDate(t.date)
      setTime(t.time)
      setEditId(id)
    }
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const handleAddOrUpdate = () => {
    if (editId) {
      // Editing existing todo
      let updatedTodos = todos.map(item => {
        if (item.id === editId) {
          return { ...item, todo, date, time }
        }
        return item
      })
      setTodos(updatedTodos)
      setEditId(null)
    } else {
      // Adding new todo
      setTodos([...todos, { id: uuidv4(), todo, date, time, isCompleted: false }])
    }

    setTodo("")
    setDate("")
    setTime("")
    saveToLS()
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleDateChange = (e) => {
    setDate(e.target.value)
  }

  const handleTimeChange = (e) => {
    setTime(e.target.value)
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => item.id === id)
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    saveToLS()
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-green-300 min-h-[80vh] md:w-[35%]">
        <h1 className='font-bold text-center text-3xl'>iTask - Manage your todos at one place</h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>{editId ? "Edit Todo" : "Add a Todo"}</h2>
          <div className="flex flex-col gap-3">

            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter task..."
              className='w-full rounded px-4 py-2'
            />

            <input
              onChange={handleDateChange}
              value={date}
              type="date"
              className='w-full rounded px-4 py-2'
            />

            <input
              onChange={handleTimeChange}
              value={time}
              type="time"
              className='w-full rounded px-4 py-2'
            />

            <button
              onClick={handleAddOrUpdate}
              disabled={todo.length <= 3}
              className='bg-violet-800 mx-2 rounded hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
            >
              {editId ? "Update Todo" : "Save"}
            </button>
          </div>
        </div>

        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2' htmlFor="show">Show Finished</label>

        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>

        <h2 className='text-2xl font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos
            .filter(item => showFinished || !item.isCompleted)
            .map(item => (
              <div key={item.id} className="todo flex flex-col md:flex-row md:justify-between my-3 p-3 rounded bg-green-100">
                <div className='flex gap-5 items-center'>
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? "line-through text-gray-500" : ""}>
                    <div className='font-semibold'>{item.todo}</div>
                    <div className='text-sm text-gray-700'>{item.date} {item.time}</div>
                  </div>
                </div>
                <div className="buttons flex mt-3 md:mt-0">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  ><FaEdit /></button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  ><AiFillDelete /></button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default App
