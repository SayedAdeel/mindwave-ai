const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { if(e.key==='Enter') handleSend(); });

async function handleSend(){
  const message = userInput.value.trim();
  if(!message) return;
  addMessage('user', message);
  userInput.value = '';

  // Call serverless function
  const reply = await getAIResponse(message);
  addMessage('bot', reply);
}

function addMessage(sender, message){
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message', sender==='user'?'user-msg':'bot-msg');
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Call Vercel serverless API
async function getAIResponse(message){
  try{
    const response = await fetch('/api/mindwave', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
  } catch(err){
    console.error(err);
    return "Sorry, MindWave is having trouble replying right now.";
  }
}
