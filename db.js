import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.DB_URI;

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Connected to Mongo Successfully');
    });
}

export default connectToMongo;