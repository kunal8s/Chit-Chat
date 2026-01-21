import { useEffect, useState } from "react";
import toast from "react-hot-toast";



const useGetConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                if(data.error){
                    throw new Error(data.error);
                }
                setConversations(data);
            } catch (err) {
                // console.log(err);
               toast.error(err.message);
            }
            finally {
                setLoading(false);
            }
        }
        getConversations();
    },[]);
    return {loading,conversations }
}

export default useGetConversations;
    