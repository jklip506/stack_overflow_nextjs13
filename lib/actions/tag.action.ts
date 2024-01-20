"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/models/tag.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return [{ _id: '1', name: 'tag1' }, { _id: '2', name: 'tag2' }, { _id: '3', name: 'tag3' }];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {

        await connectToDatabase();

        const tags = await Tag.find({}).sort({ createdAt: -1 });

        return { tags };

    } catch (error) {

        console.log(error);
        throw error;
    }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
    try {
        await connectToDatabase();
        const { tagId, page = 1, pageSize = 20, searchQuery } = params;

        const tagFilter: FilterQuery<ITag> = { _id: tagId };

        const question = await Tag.findOne(tagFilter)
            .populate({
                path: 'questions', model: 'Question',
                match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {},
                populate: [
                    { path: 'tags', model: 'Tag', select: '_id name' },
                    { path: 'author', model: 'User', select: '_id clerkId name picture' }
                ]
            })
            .sort({ createdAt: -1 });
        if (!question) {
            throw new Error("Question not found");
        }

        return { question }


    } catch (error) {
        console.log(error);
        throw error;
    }
}