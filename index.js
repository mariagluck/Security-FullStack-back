import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { connect } from './libs/database.js';
import { User } from './models/user.js';
import jwt from  'jsonwebtoken';
import { messagerules } from './validation/messagevalidation.js';
import { validationResult } from 'express-validator';

dotenv.config();
await connect();

const app = express();
app.use(express.json());
app.use(cors());


//Register a new user
app.post("/register", async (req, res) => {
    const user = await User.register(req.body);

    if (!user) {
        return res.status(400).json({ success: false  });
    } 
    res.status(201).json({ success: true });
})

// LOgin using email and password
app.post("/login", async (req, res) => {
    const user = await User.login(req.body);

    if (!user) {
        return res.status(400).json({ user });
    }
    //CREATE JWT TOKEN
    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    res.json({ user , token});
})

const checkLogin = (req, res, next) => {
    const rawJWTHeader = req.headers.authorization;
    
    if (!rawJWTHeader) {
        return res.sendStatus(401);
    }

    const token = rawJWTHeader.slice(7);
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          console.log("jwt error", err.message);
          return res.sendStatus(401);   
        }

        console.log(decoded);
        next();
    });
}


//this middleware returns an array of middleware functions
const validate = (rules) => {
    const middlewares = rules;

    middlewares.push((req, res, next) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    });

    return middlewares;
}


const messages = ["First message!"];
app.post("/message", checkLogin, validate(messagerules), (req, res) => {
    messages.push(req.body.message);
    res.send(messages);
})


//If all other middleware wont will handle the request, this will
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Resource not found 😭"})
})



app.listen(process.env.PORT, () => {
    console.log("Listening on http://localhost:"+ process.env.PORT);
});