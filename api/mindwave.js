import fetch from "node-fetch";

export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });
  const { message } = req.body;
  if(!message) return res.status(400).json({ error:"No message provided" });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Vercel env variable

  try{
    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[
          { role:"system", content:"You are MindWave AI. Reply in English or Hindi based on user input." },
          { role:"user", content: message }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch(err){
    console.error(err);
    res.status(500).json({ reply:"MindWave is having trouble replying right now." });
  }
}
