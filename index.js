import express from 'express';
import connectToMongo from './db.js';
import User from './models/User.js';
import getUsers from './api.js';
import cors from 'cors';

const app = express();
app.use(express.json())

app.use(cors({ origin: true }));
connectToMongo();

//Home page
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('HOME')
})
app.listen(port, () => { console.log(`Listenning at http://localhost:${port}`) })

//Getting data from API Link and saving to database
app.post('/api/addusers', (req, res) => {
    User.find((err, data) => {
        if (data.length === 0) {
            getUsers();
            return res.status(200).json({ "Success": true, "message": "Successfully added users to the database" });
        }
        else {
            res.status(403).json({ "Success": false, "message": "User Data Already Exists" });
        }
    })
});

//Fetch all Users data from Database
app.get('/api/fetchallusers', (req, res) => {
    User.find((err, data) => {
        if (err) {
            res.status(404).json({ message: err.message });
        }
        else { res.status(200).json(data); }
    })
});

//Update user data and save to Database
app.put('/api/updateuser/:id', async (req, res) => {
    let { name, email, gender, status } = req.body;
    let upid = req.params.id;
    let upname = name;
    let upemail = email;
    let upgender = gender;
    let upstatus = status;
    User.findOneAndUpdate({ id: upid }, { $set: { name: upname, email: upemail, gender: upgender, status: upstatus } }, { new: true }, (err, data) => {
        if (data === null) {
            return res.status(404).send("Not Found")
        }
        else {
            res.json({ "Success": "User has been Updated successfully", data });
        }
    })
})

//Delete User from the Database
app.delete('/api/deleteuser/:id', async (req, res) => {
    try {
        User.findOneAndDelete({ id: req.params.id }, (err, data) => {
            if (data === null) { return res.status(404).send("Not Found") };
            res.json({ "Success": "User has been deleted successfully", data });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error ");
    }
})

//Delete All Users from the Database
app.delete('/api/deleteallusers', (req, res) => {
    try {
        User.find(async (err, data) => {
            var len = data.length;
            if (len > 0) {
                await User.deleteMany({ "__v": 0 });
                res.json({ "Success": "User has been deleted successfully" });
            }
            else {
                res.json({ "message": "No users were found in the database" });
            }
        })
    } catch (error) {
        res.status(500).json({ "message": "Internal server error - " + error.message });
    }
})