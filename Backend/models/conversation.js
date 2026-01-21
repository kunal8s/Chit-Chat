const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
   participants: [
         {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'user',
              required: true
         }
    ] ,
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'message',
            default: []
        }
    ]
},{timestamps:true});

module.exports = mongoose.model('conversation',conversationSchema);