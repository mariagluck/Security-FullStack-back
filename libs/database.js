import mongoose from 'mongoose';

export function connect() {
    mongoose.connection.on("error",         (e) => console.log("[M] Error", e))
    mongoose.connection.on("connecting",    () => console.log("[M] Connecting"))
    mongoose.connection.on("connected",     () => console.log("[M] Connected"))
    mongoose.connection.on("disconnecting", () => console.log("[M] Disconnecting"))
    mongoose.connection.on("disconnected",  () => console.log("[M] Disconnected"))

    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const connectionString = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

    return mongoose.connect(connectionString);
}