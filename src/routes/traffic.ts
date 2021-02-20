import { Router } from "express";
import { Bug } from "../models/Bug";

const router = Router();

router.get("/", async (req, res) => {
	const bugs = await Bug.find();
	// Parse targets
	let targets = getTargets(req.query["target"]);
	let mode: "EXPLICIT" | "IMPLICIT" = "EXPLICIT";
	const invalidTargets = targets.filter(
		(t) => isNaN(+t) || bugs.every((b) => b.id !== +t)
	);
	if (invalidTargets.length) {
		return res
			.status(400)
			.json({ code: "INVALID_TARGETS", invalid: invalidTargets });
	}
	if (!targets.length) {
		targets = bugs.map((b) => b.id.toString());
		mode = "IMPLICIT";
	}

	// Get targets
	const targetedBugs = bugs.filter((b) => targets.includes(b.id.toString()));
	const targetedDevices = targetedBugs
		.flatMap((t) =>
			t.pings[0].time.getTime() > Date.now() - 600_000 ? t.pings[0].devices : []
		)
		// Remove duplicates
		.filter(
			(elem, index, self) =>
				self.findIndex((e) => e.address === elem.address) === index
		);

	res.json({
		targets: targets.map((t) => +t),
		mode: mode,
		devices: targetedDevices.length,
		bugs: targetedBugs.map((b) => ({
			id: b.id,
			name: b.name,
			lastPing: b.pings[0].time,
			unweighted: !(b.pings[0].time.getTime() > Date.now() - 600_000),
		})),
	});
});

function getTargets(params: unknown): string[] {
	let newParams = params as string | string[] | undefined;
	if (!newParams) return [];
	if (typeof newParams === "string") newParams = [newParams];
	return newParams.flatMap((p) => p.split(","));
}

module.exports = router;
