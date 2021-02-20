import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate";
import { wall } from "../middlewares/auth";
import { Bug } from "../models/Bug";
import { Device } from "../models/Device";

const router = Router();

const schema = Joi.object({
	devices: Joi.array()
		.required()
		.items(
			Joi.object({
				address: Joi.string().required(),
				name: Joi.string().optional().allow(null),
				type: Joi.number().optional().allow(null),
			})
		),
});

router.post("/", wall, validate(schema), async (req, res) => {
	const now = new Date();
	const devices: {
		address: string;
		name?: string;
		type?: number;
	}[] = req.body.devices.map((d: any) => ({
		address: d.address,
		name: d.name || undefined,
		type: d.type,
	}));

	const bluetoothAddressRegex = /^([0-9A-F]{2}):([0-9A-F]{2}):([0-9A-F]{2}):([0-9A-F]{2}):([0-9A-F]{2}):([0-9A-F]{2})$/;
	const anormal = devices.filter((d) => !bluetoothAddressRegex.test(d.address));
	if (anormal.length) {
		console.warn(`Invalid bluetooth addresses sent by bug [${req.bugId}] :`);
		anormal.forEach((a, i) =>
			i < 10 ? console.log(a.address, a.name, a.type) : undefined
		);
		return res.status(400).json({
			code: "REVERSE_ENGINEERING_SUSPICTION",
			message: "Hi. You're human? Good job. Please don't play with that ;)",
		});
	}

	// Update bug's ping history
	const bug = await Bug.findOne({ id: req.bugId });
	if (!bug) return res.status(500).json({ code: "IMPOSSIBLE_ERROR" });
	bug.pings.unshift({
		time: now,
		devices,
	});
	await bug.save();

	// Update devices' pings
	for (const d of devices) {
		let device =
			(await Device.findOne({ address: d.address })) ||
			new Device({
				address: d.address,
			});

		device.name = d.name;
		device.type = d.type;

		device.pings.unshift({
			as: {
				name: d.name,
				type: d.type,
			},
			bug: bug.id,
			time: now,
		});

		await device.save();
	}
	res.status(201).json({
		code: "SUCCESS",
	});
});

module.exports = router;
