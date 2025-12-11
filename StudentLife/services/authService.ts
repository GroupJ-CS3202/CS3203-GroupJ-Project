const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const API_BASE = "";

export interface User 
{
    id: number | string;
    name? : string;
    email : string;
}

export interface LoginResult 
{
    token : string;
    user : User;
}

export async function login (email : string, password : string): Promise<LoginResult> //fetches a authentication token from the api
{
    const res = await fetch('${API_BASE}/api/login', {
        method : "POST", 
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify({email, password}), 
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) 
    {
        const msg = (data && (data.error || data.message)) || 'Login failed with status ${res.status}'; 
        throw new Error (msg);
    }

    if (!data?.token || !data?.user) 
    {
        throw new Error("Invalid login response from server.");
    }

    return {
        token : data.token, 
        user: data.user,
    }
}

export function saveAuth(token:string, user : User)
{
}