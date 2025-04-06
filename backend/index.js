const express = require("express");
require("dotenv").config();
const cors = require('cors');
const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello this is backend"); 
});

app.get("/api/fruits", (req, res) => {
    const fruits = [
        { id: 1, title: "Apple", content: "This is apple" },
        { id: 2, title: "Banana", content: "This is banana" },
        { id: 3, title: "Mango", content: "This is mango" },
    ];
    res.send(fruits);
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is listening");
});