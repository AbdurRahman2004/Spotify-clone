import express from "express";
import cors from "cors";
import 'dotenv/config'
import songRouter from "./src/routes/songRouter.js";
import connectDB from "./src/config/Mongodb.js";
import connecCloudinary from "./src/config/Cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";

//app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connecCloudinary();

//middlewares
app.use(express.json()); // the request are parsed using json method
app.use(cors()); // allow frontend and backend

// initializing Routes
app.use("/api/song",songRouter);
app.use("/api/album",albumRouter);

app.get('/',(req,res)=>{
    res.send("Api Working");
})

app.listen(port,()=>console.log(`Server Started on port ${port}`))

