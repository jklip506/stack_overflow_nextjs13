import mongoose, { Document, Schema } from 'mongoose';

interface ITag extends Document {
    name: string;
    description: string;
    questions: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdOn: Date;
}

const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

const Tag = mongoose.model<ITag>('Tag', TagSchema);

export default Tag;