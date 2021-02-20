import express from "express";
import morgan from "morgan";
import { identify } from "./middlewares/auth";

const app = express();

// Log
app.use(morgan("dev"));

// Parse
app.use(express.json());

// Identify
app.use(identify);

app.use("/ping", require("./routes/ping"));
app.use("/self", require("./routes/self"));

app.use("/bugs", require("./routes/bugs"));
app.use("/traffic", require("./routes/traffic"));

app.all("/", (req, res) => res.send("hello"));

app.use((req, res) => res.status(404).json({ code: "NOT_FOUND" }));

app.listen(8000, () => {
	console.log("☢ Server is operational");
});
