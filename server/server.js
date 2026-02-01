import { connectDB } from "./config/db.js";
import app from "./app.js";


//---------------------
//DataBase Connection
//---------------------
connectDB();

//---------------------
//start server
//---------------------
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})


//---------------------
//Error Handling
//---------------------
process.on("unhandledRejection", (err) => {
    console.error(`unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
    console.error(`uncaught Exception : ${err.message}`);
    process.exit(1);
});

export default server;