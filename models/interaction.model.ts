import mongoose, { Document, Schema } from 'mongoose';

interface IInteraction extends Document {
    user: Schema.Types.ObjectId;
    action: string;
    question: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId;
    createdAt: Date;
}

const InteractionSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        enum: ['view'],
        required: true
    },
    question: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    answer: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Interaction = mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;