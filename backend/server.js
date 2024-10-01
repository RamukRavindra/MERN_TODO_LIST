// Using Express
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

// Create an instance of express
const app = express();

// Adding middleware to decode the data
app.use(express.json())
app.use(cors())

// let todos = [];

// Connecting MongooDB
mongoose.connect('mongodb://127.0.0.1:27017/mern-todolist')
    .then(() => {
        console.log("DB Connected!");
    }).catch((err) => {
        console.log(err);
    });

// Creating SChema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String
});

// Creating model
const todoModel = mongoose.model('TodoList', todoSchema);

// Create a new todo item
app.post('/todos/create', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);/
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Get All todo Item
app.get('/todos/get-all', async (req, res) => {
    try {
        const todoData = await todoModel.find();
        res.json(todoData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update a todo Item
app.put('/todos/update/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {
                title,
                description
            },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found!" })
        }
        res.json(updatedTodo)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo Item
app.delete('/todos/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Start the Server
const port = 8000;
app.listen(port, () => {
    console.log("Server listening to port" + port);

});