import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export function validate(
	schema: ObjectSchema
): (req: Request, res: Response, next: NextFunction) => unknown {
	return function (req, res, next) {
		const validation = schema.validate(req.body);
		const error = !!validation.error;
		if (error) return res.status(422).json({ code: "INVALID_BODY" });
		return next();
	};
}
