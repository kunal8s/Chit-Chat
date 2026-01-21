const Conversation = require("../models/conversation");
const Message = require("../models/message");
const { getReceiverSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const {message} = req.body;
        const senderId = req.user._id;
       
       let conversation= await Conversation.findOne(
            {participants:{$all:[senderId,receiverId]}},
        );
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // SOCKETIO Functionality

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // io.to(<socket-id>).emit(<event-name>,<data>) is used to sent the event to the specific client
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }

        res.status(201).json(newMessage);
        // console.log("5")
    }
    catch(error){
        // console.log("6")
        // console.log('Error in sendMessage controller :',error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

const getMessages= async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne(
            {participants:{$all:[senderId,receiverId]},}
        ).populate('messages');

        if(!conversation){
            return res.status(200).json([]);
        }
        const messages = conversation.messages;
        res.status(200).json(messages);
    // console.log("7")
}
    catch(error){
        // console.log("8")
        // console.log('Error in getMessages controller :',error.message);
        res.status(500).json({error:"Internal server error"});
    }
}


module.exports =  {
    sendMessage,
    getMessages,
}
