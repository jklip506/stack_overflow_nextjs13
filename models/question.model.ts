import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
    title: string;
    content: string;
    tags: { _id: string, name: string }[];
    views: number;
    upvotes: string[];
    downvotes: Schema.Types.ObjectId[];
    author: {
        _id: string;
        clerkId: string;
        name: string;
        picture: string;

    };
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    views: {
        type: Number,
        default: 0
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;