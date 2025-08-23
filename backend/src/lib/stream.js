import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STEAM_API_KET ;
const apiSecret = process.env.STEAM_API_SECRET ;

if(!apiKey || !apiSecret){
    console.log("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey ,apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.log("Error in creating stream user",error)
    }
} 

// do it letter

export const generateStreamToken = (userId) =>{
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
        
    } catch (error) {
        console.log("Error in generating stream token",error)
    }
}