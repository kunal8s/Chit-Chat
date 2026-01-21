import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
const useSignup = () => {
 const [loading, setLoading] = useState(false);
 const {authUser, setAuthUser} = useAuthContext();


 const signup = async ({fullName, username, password, confirmPassword,gender}) => {
    const success =handleInputErrors({fullName, username, password, confirmPassword,gender});
    if(!success) return;
    setLoading(true);
    try{
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fullName, username, password,confirmPassword,gender})
        });

        const data = await res.json();
        if(data.error){
           throw new error(data.error);
        }
        // local storage
        localStorage.setItem('chat-user', JSON.stringify(data));
        // context
        setAuthUser(data);
    }
    catch(err){
        toast.error(err.message);
    }

    finally{
        setLoading(false);
    }
 }
 return {loading, signup}
}

export default useSignup

function handleInputErrors({fullName, username, password, confirmPassword,gender}){
    if(!fullName || !username || !password || !confirmPassword || !gender){
        // here for showing error we are using a library called react-hot -toast

        toast.error('Please fill all the fields');
        return false;
    }

    // this handle both client side and server side validation
    if(password !== confirmPassword){
        toast.error('Passwords do not match');
        return false;
    }

    if(password.length < 6){
        toast.error('Password must be atleast 6 characters long');
        return false;
    }
    return true;
}