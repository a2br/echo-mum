import { Router } from "express";
import { wall } from "../middlewares/auth";
import { Bug } from "../models/Bug";

const router = Router();

router.get("/", wall, async (req, res) => {
	const self = await Bug.findOne({ id: req.bugId });
	if (!self) return;
	const json = self.toJSON();
	res.json({
		id: json.id,
		name: json.name,
	});
});

module.exports = router;
