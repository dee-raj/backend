import mongoose from "mongoose";

export const getMongoDBConnected = async () => {
    const url = process.env.MONGODB_URL;
    await mongoose.connect(url, { dbName: "auth" })
        .then(() => {
            console.log("MongoDB is connected successfully !");
        })
        .catch((error) => {
            console.log(`There is some error to connect MongoDB. \n${error}`);
            process.exit(1);
        });
}
