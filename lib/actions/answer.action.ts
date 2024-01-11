"use server";
import Answer from "@/models/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/models/question.model";
import User from "@/models/user.model";

export async function createAnswer(params: CreateAnswerParams) {
    try {

        await connectToDatabase();

        const { content, author, question, path } = params;

        const answer = await Answer.create({
            content,
            author,
            question,
        });

        await Question.findByIdAndUpdate(question, {
            $push: { answers: answer._id }
        });

        // todo: add interaction record for user's answer_question action

        revalidatePath(path);

    } catch (error) {

        console.log(error);
        throw error;
    }
}

export async function getAllAnswers(params: GetAnswersParams) {

    const { questionId } = params;

    try {
        await connectToDatabase();

        const answers = await Answer.find({ question: questionId })
            .populate({ path: 'author', model: User, select: '_id clerkId name picture' })
            .populate({ path: 'question', model: Question })
            .sort({ createdAt: -1 });

        return { answers };
    } catch (error) {
        console.log(error);
        throw error;
    }


}