/* eslint-disable no-empty */
"use server"

import Tag from "@/models/tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/models/question.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";


export async function getQuestions(params: GetQuestionsParams) {
    try {
        await connectToDatabase();

        const questions = await Question.find({})
            .populate({ path: 'author', model: User })
            .populate({ path: 'tags', model: Tag })
            .sort({ createdAt: -1 });

        return { questions };

    } catch (error) {

        console.log(error);
        throw error;

    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase();

        const { title, content, tags, author, path } = params;

        const question = await Question.create({
            title,
            content,
            author,
        });

        const tagDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id);

        }

        // update the question
        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } }
        });

        // create an interaction record for the user's ask_question action

        // Increment the user's reputation by +5 for creating a question

        revalidatePath(path);

    } catch (error) {
        console.error("Error creating question:", error);
        throw error;
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        await connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({ path: 'author', model: User, select: '_id clerkId name picture' })
            .populate({ path: 'tags', model: Tag, select: '_id name' });

        return { question };

    } catch (error) {
        console.error("Error getting question by id:", error);
        throw error;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {

        await connectToDatabase();
        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let update;
        if (hasupVoted) {
            update = { $pull: { upvotes: userId } };
        } else if (hasdownVoted) {
            update = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
        } else {
            update = { $addToSet: { upvotes: userId } };
        }

        const upvote = await Question.findByIdAndUpdate(questionId, update, { new: true });

        if (!upvote) {
            throw new Error("Question not found");
        }

        revalidatePath(path);

    } catch (error) {
        console.error("Error upvoting question:", error);
        throw error;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {

        await connectToDatabase();
        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let update;
        if (hasdownVoted) {
            update = { $pull: { downvotes: userId } };
        } else if (hasupVoted) {
            update = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
        } else {
            update = { $addToSet: { downvotes: userId } };
        }

        const downvote = await Question.findByIdAndUpdate(questionId, update, { new: true });

        if (!downvote) {
            throw new Error("Question not found");
        }

        revalidatePath(path);

    } catch (error) {
        console.error("Error downvoting question:", error);
        throw error;
    }
}