import {useState,useEffect} from 'react'
import {useNavigate } from 'react-router-dom';

export function useValidToken(){
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const usertoken = localStorage.getItem('token');
        if (!usertoken) {
            console.error("No token found, redirecting to login...");
            navigate('/');
            return;
        }
        setToken(usertoken);
    },[navigate])
    return token
}