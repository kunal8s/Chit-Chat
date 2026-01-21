import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				// console.log("data is in useGetMessage:",data)
				// console.log("messages is in useGetMessage:",messages)
                // console.log("3")
				// console.log("data.messages :",data.messages)
				setMessages(data);
				// console.log("messages is in useGetMessage after set:",messages)
			} catch (error) {
                // console.log("I am inside useGetMessages.js file catch" )
                // console.log("4")
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;