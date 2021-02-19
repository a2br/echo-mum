import { Request, Response, NextFunction } from "express";
import { Bug } from "../models/Bug";

export async function identify(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"] || "";
	const found = await Bug.findOne({ token: authHeader });
	if (found) {
		req.bugId = found.id;
		found.lastSeenAt = new Date();
		await found.save();
	}
	next();
}

export async function wall(req: Request, res: Response, next: NextFunction) {
	if (!req.bugId) return res.status(401).json({ code: "UNAUTHORIZED" });
	next();
}
