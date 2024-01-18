"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/models/question.model";


export async function getUserById(params: any) {
    try {
        await connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        await connectToDatabase();

        // you can set page to one if it does not exist and page size to 20 if it does not exist
        // const { page = 1, pageSize = 20, filter, searchQuery } = params;

        const users = await User.find({}).sort({ createdAt: -1 });

        return { users };

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDatabase();

        const { clerkId, name, username, email, picture } = userData;
        const newUser = await User.create({
            clerkId,
            name,
            username,
            email,
            picture
        });

        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(userData: UpdateUserParams) {
    try {
        await connectToDatabase();

        const { clerkId, updateData, path } = userData;

        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true,
        });

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(userData: DeleteUserParams) {
    try {
        await connectToDatabase();

        const { clerkId } = userData;

        const user = await User.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error("User not found");
        }

        // delete user from database, and questions, ansers, comments, etc.

        // const userQuestionIds = await Question.find({ auther: user._id }).distinct("_id");

        // delete all questions
        await Question.deleteMany({ auther: user._id });

        // TODO: delete all answers

        const deletedUser = await User.findByIdAndDelete(user._id);

        return deletedUser;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        await connectToDatabase();
        const { userId, questionId, hasSaved, path } = params;

        // check if questionId is in savedQuestions array
        let toggle;
        if (hasSaved) {
            toggle = { $pull: { savedQuestions: questionId } };
        } else {
            toggle = { $addToSet: { savedQuestions: questionId } };
        }

        await User.findByIdAndUpdate(userId, toggle, { new: true });

        revalidatePath(path);

    } catch (error) {

    }
}