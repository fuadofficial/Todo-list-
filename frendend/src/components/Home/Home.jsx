import { useState, useRef, useEffect } from "react";
import AddItem from "../AddItem/AddItem";
import TodoList from "../TodoList/TodoList";
import "./Home.css";
import axios from "axios";

const API_URL = "http://localhost:3000/api/todo"

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const inputRef = useRef(null);


    useEffect(() => {
        fetchTodo()
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const fetchTodo = async () => {
        const response = await axios(API_URL)
        try {
            setTodos(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const addValue = async () => {
        if (inputValue) {
            try {
                const response = await axios(API_URL, {
                    method: 'POST',
                    data: {
                        todo: inputValue
                    }
                })
                setTodos(response.data);
                setEditIndex(null)
                setInputValue("");
            } catch (error) {
                console.log(error.response.data.message);
            }
        } else {
            alert('Please enter any values')
        }
        inputRef.current.focus();
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addValue();
        }
    };

    const deleteItem = (index) => {
        setTodos(todos.filter((_, item) => item !== index));
        if (index === editIndex) {
            setEditIndex(null);
            setInputValue("");
        }
    };

    const editItem = (index) => {
        setInputValue(todos[index].name);
        setEditIndex(index);
        inputRef.current.focus();
    };

    return (
        <div className="home-container">
            <div className="todo-list">
                <div className="heading">
                    <h1>MOBILE SHOP</h1>
                </div>
                <div className="add-item">
                    <AddItem
                        handleKeyDown={handleKeyDown}
                        inputValue={inputValue}
                        handleChange={handleChange}
                        addValue={addValue}
                        inputRef={inputRef}
                    />
                </div>
                <div className="todo-list">
                    <TodoList todos={todos} deleteItem={deleteItem} editItem={editItem} />
                </div>
            </div>
        </div>
    );
};

export default Home;
