const express = require('express')
const cors = require('cors');

//login
/* const mongoose = require('mongoose')
const EmployeeModel = require('./models/employees') */

const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

//middlewares
app.use(express.json())
app.use(cors())

/* //login */
/*mongoose.connect(process.env.MONGO_URI)  , {
    useNewUrlParser: truePORT
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('DB Connected')) */

/* app.listen(PORT, () => {
    console.log('listening to port:', PORT)
}) */


//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()

//home
/* app.post('/api/users/login', (req, res) => {
    const {email, password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json("Success")
            } else {                
                res.json({error: 'Invalid Password'})
            }
        }
    })
}) */

//login
/* app.post('/api/users/register', (req, res) => {
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err)) 
}) */