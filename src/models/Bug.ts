export { Bug, IBugDoc };

import { Document, Schema, model } from "mongoose";

interface IBugDoc extends Document {
	id: number;
	name: string;
	token: string;
	lastSeenAt: Date;
	pings: Array<{
		time: Date;
		devices: Array<{
			address: string;
			name?: string;
			type?: number;
		}>;
	}>;
}

const BugSchema = new Schema({
	id: Number,
	name: String,
	token: String,
	lastSeenAt: { type: Date, default: Date.now },
	pings: [
		{
			time: { type: Date, default: Date.now },
			devices: [
				{
					address: String,
					name: { type: String, required: false },
					type: { type: Number, required: false },
				},
			],
		},
	],
});

const Bug = model<IBugDoc>("bugs", BugSchema);
