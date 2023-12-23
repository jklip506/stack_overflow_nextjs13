"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
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

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDatabase();

        const newUser = await User.create({
            userData
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

        const userQuestionIds = await Question.find({ auther: user._id }).distinct("_id");

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