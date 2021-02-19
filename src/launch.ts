/**
 * This script makes the code ready to run by initializing the
 * DB connections before the rest of the code is executed.
 */

require("dotenv").config();

import mongoose from "mongoose";

(async function () {
	//! Config MongoDB
	const mongoConnection = await mongoose
		.connect(process.env.MONGO_AUTH || "", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		.then(() => {
			console.log("✔ Successfully connected to mongo");
		})
		.catch((error) => {
			console.error("MONGOOSE CONN ERR", error);
		});

	//! Handling DB errors
	mongoose.connection.on("error", (err) => {
		console.error("MONGOOSE ERR", err);
	});

	//! Launching the app
	require("./app");
})();

// Trash cleaning

function cleanUp(reason: string) {
	if (reason === "exit 42") return;
	mongoose.disconnect();
	console.log("Cleaning", reason);
	process.exit(42);
}

process.on("exit", (code) => cleanUp("exit " + code));
process.on("SIGINT", () => cleanUp("SIGINT"));
process.on("SIGUSR1", () => cleanUp("SIGUSR1"));
process.on("SIGUSR2", () => cleanUp("SIGUSR2"));
