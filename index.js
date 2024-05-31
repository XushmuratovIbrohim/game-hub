import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { register, login, getMe, updateUser } from "./controllers.js";
import { registerValidators, loginValidators } from "./validators.js";
import { handleValidationErrors } from "./utils/handleValidationErrors.js";
import { checkAuth } from "./utils/checkAuth.js";
mongoose.connect(process.env.MONGODB_URI).then(() => {
   console.log('sucsess')
}).catch((e) => {
   console.log(e);
})

const app = express();
app.use(express.json())
app.use(cors());


app.post("/register", registerValidators, handleValidationErrors, register)
app.post("/login", loginValidators, handleValidationErrors, login)
app.get("/getMe", checkAuth, getMe)
app.patch("/updateUser", checkAuth, updateUser)

app.listen(process.env.PORT || 1111, () => {
    console.log("Server started on http://localhost:1111");
})