import express from "express";
import morgan from "morgan";
import { identify, wall } from "./middlewares/auth";

const app = express();

// Log
app.use(morgan("dev"));

// Parse
app.use(express.json());

// Identify
app.use(identify);

// Protect
app.use(wall);

app.use("/ping", require("./routes/ping"));
app.use("/self", require("./routes/self"));

app.all("/", (req, res) => res.send("hello"));

app.listen(8000, () => {
	console.log("☢ Server is operational");
});
