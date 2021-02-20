# /docs/start

Wanna try Echo? Cool, here's how.

## 1. Install the project

Nothing more easy. You know the drill: `git clone`, `npm i`...

## 2. Configure your database

You just need to create a MongoDB database. If you don't want to be bothered by this kind of stuff, try [Atlas](https://www.mongodb.com/cloud/atlas) (they have a free tier).
When you're done, create a user, whitelist your IP, copy the auth URI, and paste it in `.env` in the `MONGO_AUTH` key.

## 3. Create bugs

Not bugs, _bugs_. These are the Bluetooth devices that will send data to your server. In the database, they should be in the `bugs` collection. Remember that you can change that in the source code --it's yours. Create them manually or through a program with Mongoose (recommended), it doesn't matter. They should look like this:

```json
{
	"_id": "filled_by_mongoDB",
	"id": 1, // Simple id so humans can easily indentify them
	"name": "Whatever", // Human readable name
	"token": "abcxyz", // Secret token to identify bugs
	"pings": [], // Filled automatically as the servre gets info
	"__v": 42, // filled by mongoose
	"lastSeenAt": Date
}
```

## 4. Configure your bugs

Configure your bugs by specifying the right server URI and giving them their token, and you're good to go!
