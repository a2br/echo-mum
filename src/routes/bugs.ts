import { Router } from "express";
import { Bug } from "../models/Bug";

const router = Router();

router.get("/", async (req, res) => {
	const allBugs = await Bug.find();
	const bugs = allBugs.map((b) => ({
		id: b.id,
		name: b.name,
		lastPing: b.pings[0].time,
	}));
	res.json(bugs);
});

module.exports = router;
