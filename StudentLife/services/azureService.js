export async function callAi(prompt) {

    if (!prompt || !prompt.trim())
    {
        throw new Error ("Prompt cannot be empty!");
    }

    const res = await fetch ("/api/ai-completion", {
        method: "POST", 
        headers : {
           "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({prompt}), 
    }); //send the request and await response

    if (!res.ok) 
    {
        throw new Error('Request failed with with status $(res.status)')
    }

    const data = await res.json();

    return data.reply;
}