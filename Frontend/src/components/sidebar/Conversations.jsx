// import useGetConversations from "../../hooks/useGetConversations";
// import { getRandomEmoji } from "../../utils/emojis";
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	const {loading,conversations} = useGetConversations();

// 	  console.log( "CONVERSATIONS :" ,conversations);


// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>

// 			{conversations.map((conversation,idx) => (
// 				<Conversation key={conversation._id} conversation={conversation}
// 				emoji={getRandomEmoji()}
// 				lastIdx={idx === conversations.length-1} />
// 			))}
// 			{loading ? <span className="loading loading-spinner mx-auto"></span> :null}
// 		</div>
// 	);
// };
// export default Conversations;




import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	console.log("CONVERSATIONS:", conversations);

	// 🚨 If not an array, handle gracefully
	if (!Array.isArray(conversations)) {
		return (
			<div className='py-2 text-center text-red-500'>
				{loading ? "Loading..." : "Failed to load conversations. Please log in again."}
			</div>
		);
	}

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}
			{loading && <span className="loading loading-spinner mx-auto"></span>}
		</div>
	);
};

export default Conversations;
