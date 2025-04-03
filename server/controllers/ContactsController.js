import User from "../models/UserModels.js";
import mongoose from 'mongoose';
import Message from "../models/MessagesModel.js"
export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (!searchTerm) {
            return response.status(400).send("Search Term is required.");
        }

        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const searchTerms = escapedSearchTerm.split(' ').map(term => new RegExp(term, "i"));

        const userId = new mongoose.Types.ObjectId(request.id);

        const contacts = await User.find({
            $and: [
                {
                    $or: [
                        { $and: [ { firstName: searchTerms[0] }, { lastName: searchTerms[1] || searchTerms[0] } ] },  // Match first and last name combo
                        { firstName: { $in: searchTerms } },
                        { lastName: { $in: searchTerms } },
                        { phone: { $in: searchTerms } },
                        { UserName: { $in: searchTerms } }
                    ]
                }
            ]
        }).select({ password: 0, OTP: 0 });

        return response.status(200).json({ contacts });
    } catch (error) {
        return response.status(500).send(`Internal server error ${error}`);
    }
};


export const getUserListForDM = async (request, response, next) => {
    try {
        let userId = request.id;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match:{
                    $or:[{sender:userId},{recipent:userId}],
                },
            },
            {
                $sort : {timestamp:-1},
            },
            {
                $group:{
                    _id:{
                        $cond:{
                            if:{$eq:["$sender",userId]},
                            then:"$recipent",
                            else:"$sender",
                        },
                    },
                    lastMessageTime:{$first:"$timestamp"},
                },
            },
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"contactInfo",
                },
            },
            {
                $unwind:"$contactInfo",
            },
            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:"$contactInfo.email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    image:"$contactInfo.image",
                    color:"$contactInfo.color",
                    UserName:"$contactInfo.UserName",
                    phone:"$contactInfo.phone",
                    bio:"$contactInfo.bio",
                    isOnline:"$contactInfo.isOnline",
                    showStatus:"$contactInfo.showStatus",
                    blockedUsers:"$contactInfo.blockedUsers",
                    blockedByUsers:"$contactInfo.blockedByUsers"
                },
            },
            {
                $sort:{lastMessageTime:-1},
            }
        ]);

        return response.status(200).json({ contacts });
    } catch (error) {
        return response.status(500).send(`Internal server error ${error}`);
    }
};