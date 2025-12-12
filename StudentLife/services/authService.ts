const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const API_BASE = "http://localhost:8081/"; //left this here for if we want to test locally.

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

export async function login (email : string, password : string): Promise<LoginResult> //fetches an authentication token from the api
{
    const res = await fetch('http://localhost:7071/api/login', { //http://localhost:7071/api/login
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

//If the user successfully logs in then we will attempt to save the token to the browser's local storage
export function saveAuth(token:string, user : User)
{
    try 
    {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    catch 
    {

    }
}

//attempts to read the user's saved authentication token form local storage on app startup
export function loadAuth(): LoginResult | null 
{
    try
    {
        const token = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);
        if (!token || !rawUser) return null;

        const user = JSON.parse(rawUser) as User;

        return {token, user};
    }
    catch
    {
        return null; //return null if there are any issues attempting to get token and user info
    }

}

//To be used during any logout protocol
export function clearAuth() 
{
    try 
    {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
    catch 
    {
        //ignore for now
    }
}

export function getAuthToken () : string | null 
{
    try 
    {
        return localStorage.getItem(TOKEN_KEY);

    }
    catch 
    {
        return null;
    }
}

export async function verifyAuthWithServer(): Promise<LoginResult | null> {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const auth = loadAuth();
  if (!auth) return null;

  try {
    const res = await fetch('http://localhost:7071/api/auth-check', { //http://localhost:7071/api/auth-check
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      clearAuth();
      return null;
    }

    if (!res.ok) {
      console.warn('[authService] auth-check failed:', res.status, data);
      return null;
    }

    if (!data?.user) {
      console.warn('[authService] auth-check returned no user');
      return null;
    }

    return {
      token: auth.token,
      user: data.user as User,
    };
  } catch (err) {
    console.warn('[authService] verifyAuthWithServer error:', err);
    return null;
  }
}

