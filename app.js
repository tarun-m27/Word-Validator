const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

// Routes
app.get('/home', (req, res) => {
    res.render('index', { result: "Enter a word to test!" });
});

app.post('/check', (req, res) => {
    const { data } = req.body;
    const word = data ? data.trim() : "";

    if (!word) {
        return res.render('index', { result: "Please enter a word." });
    }

    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            res.render('index', { result: `"${word}" is a valid English word!` });
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                res.render('index', { result: `"${word}" is not a valid English word.` });
            } else {
                res.render('index', { result: "Network error!! Please try again later." });
                console.error(error);
            }
        });
});

app.use((req, res) => {
    res.status(404).json({
        status: "failure",
        data: "Error!! please make a GET request to 'localhost:3000/home'"
    });
});

app.listen(3000, () => {
    console.log("Server is running on 'localhost:3000/home'...");
});
