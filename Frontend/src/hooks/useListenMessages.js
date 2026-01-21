import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext';
import userConversation from '../zustand/useConversation';
import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages,setMessages,selectedConversation} = userConversation();

    useEffect(() => {
      
        // we should check that the user which is selected is the same user who sent the message
        // so that when message come it visible only when the sender user is selected
        socket?.on("newMessage", (newMessage) => {
            if (newMessage.senderId === selectedConversation?._id) {
                newMessage.shouldShake = true;
                const sound = new Audio(notificationSound);
                sound.play();
                setMessages([...messages, newMessage]);
            }
        });

        // when the component is unmounted this will be called and the socket will be closed
        return () => {  // very necessary to close the socket connection
            socket?.off("newMessage");
        }
    },[socket,messages,setMessages]);


}

export default useListenMessages