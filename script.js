let breakCounter = localStorage.getItem('breakCounter') || 0;
breakCounter = parseInt(breakCounter);

async function generateFlashcards() {
  const text = document.getElementById('inputText').value;
  const flashcardDiv = document.getElementById('flashcards');
  flashcardDiv.innerHTML = "Generating...";

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Make Q&A flashcards from this: ${text}` }]
    })
  });
  const data = await response.json();
  const flashcards = data.choices[0].message.content.split('\n');

  flashcardDiv.innerHTML = "";
  flashcards.forEach(f => {
    if (f.trim()) {
      let div = document.createElement('div');
      div.className = 'flashcard';
      div.innerHTML = f + `<br><button onclick="speak('${f.replace(/'/g, '')}')">🔊</button>`;
      flashcardDiv.appendChild(div);
    }
  });

  setTimeout(() => {
    alert("⏳ 30 minutes passed. Time for a 5-minute break!");
    startBreak();
  }, 30 * 60 * 1000); // 30 min
}

function speak(text) {
  let utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}

function startBreak() {
  document.body.innerHTML = "";
  const body = document.body;
  body.style.filter = "brightness(85%)";

  const mode = breakCounter % 3;
  if (mode === 0) {
    body.innerHTML = `<audio src='calm.mp3' autoplay loop></audio>
    <img src='relax.jpg' style='width:100%;height:100vh;object-fit:cover;' />
    <h2 style='position:absolute;top:20px;left:20px;color:white;'>🎵 Calm break...</h2>`;
  } else if (mode === 1) {
    body.innerHTML = `<div style='text-align:center;padding-top:20vh;'>
      <h1>🧘 Inhale... Exhale...</h1>
      <p>“You're doing great. Keep going.”</p>
      <div id='circle' style='width:100px;height:100px;margin:0 auto;background:#cce;border-radius:50%;animation:breath 4s infinite;'></div>
    </div>
    <style>@keyframes breath { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }</style>`;
  } else {
    body.innerHTML = `<iframe src='relax-game.html' width='100%' height='100%'></iframe>`;
  }

  breakCounter++;
  localStorage.setItem('breakCounter', breakCounter);

  setTimeout(() => {
    alert("✅ Break over! Back to study mode.");
    location.reload();
  }, 5 * 60 * 1000); // 5 min break
}
