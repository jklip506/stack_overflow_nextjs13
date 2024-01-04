import mongoose, { Document, Schema } from 'mongoose';

interface IAnswer extends Document {
    content: string;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    createdAt: Date;
    question: Schema.Types.ObjectId;
}

const AnswerSchema: Schema = new Schema({
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
});

const Answer = mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;

