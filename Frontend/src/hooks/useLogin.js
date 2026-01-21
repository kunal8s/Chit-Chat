import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const login = async (username, password) => {
        // console.log("i am in first line of login")
        const success =handleInputErrors({ username, password});
    if(!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            // console.log("i am in login after fetch and this is data :" ,data)

            if(data.error){
               throw new Error(data.error);
            }
            localStorage.setItem('chat-user', JSON.stringify(data));
            // console.log("i am finally going to set auth user to data") 
            setAuthUser(data);

        } catch (err) {
          toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    }
  return {loading, login}
  
}

export default useLogin



function handleInputErrors({ username, password}){
    if( !username || !password ){
        // here for showing error we are using a library called react-hot -toast

        toast.error('Please fill all the fields');
        return false;
    }

    return true;
}