import mongoose, { Schema } from "mongoose";

const tokensSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    token: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 86400 
    }
});

export default mongoose.model("Tokens", tokensSchema);
