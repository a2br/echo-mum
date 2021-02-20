export { Device, IDeviceDoc };

import { Document, Schema, model, ObjectId } from "mongoose";

interface IDeviceDoc extends Document {
	address: string;
	name?: string;
	type?: number;
	pings: Array<{
		_id?: ObjectId;
		time: Date;
		bug: number;
		as: {
			name?: string;
			type?: number;
		};
	}>;
}

const DeviceSchema = new Schema({
	address: String,
	name: { type: String, required: false },
	type: { type: Number, required: false },
	pings: {
		type: [
			{
				time: { type: Date, default: Date.now },
				bug: Number,
				as: {
					name: { type: String, required: false },
					type: { type: Number, required: false },
				},
			},
		],
		default: [],
	},
});

const Device = model<IDeviceDoc>("devices", DeviceSchema);
