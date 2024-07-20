import { Schema, model, Document, Types } from 'mongoose';

interface ITask extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
}

const TaskSchema = new Schema<ITask>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
}, {
    collection: 'tasks',
    timestamps: true,
});

const Task = model<ITask>('Task', TaskSchema);
export default Task;
