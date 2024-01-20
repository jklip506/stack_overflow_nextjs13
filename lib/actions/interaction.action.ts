"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/models/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        await connectToDatabase();
        const { questionId, userId } = params;

        // update question view count by incfrementing by 1
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

        const existingInteraction = await Interaction.findOne({ user: userId, action: 'view', question: questionId });

        if (existingInteraction) {
            return console.log('User has already viewed this question');
        }

        await Interaction.create({ user: userId, action: 'view', question: questionId });

    } catch (error) {
        console.log(error);
        throw error;
    }
}