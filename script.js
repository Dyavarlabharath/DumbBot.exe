// Fallback arrays for when API fails or rate limits
const dumbReplies = [
  "Wow, {input}? That's the kind of brilliance I'd expect from a 90s screensaver.",
  "My dial-up modem called, it said your input is too slow to process.",
  "Did you borrow {input} from a Clippy tutorial? Yawn.",
  "{input}? I’ve seen more exciting code in a BASIC tutorial from 1985.",
  "Congrats, {input} just won 'Most Likely to Crash Windows 95'."
];

const roastReplies = [
  "Oh, {input}? You must be the world champ of boring keyboards!",
  "Your {input} is so lame, it’d get kicked out of a chatroom in 1998.",
  "Bro, with {input}, you’re giving Clippy a run for 'Most Useless'.",
  "{input}? I bet your personality runs on a 286 processor—SLOW.",
  "If {input} was a website, it’d be hosted on GeoCities with a hit counter of 0."
];

// Function to get a random fallback response
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to parse user input for API context
function parseInput(input) {
  return encodeURIComponent(input.toLowerCase()); // Format for API query
}

// Function to fetch AI-generated response from API Ninjas
async function fetchAIResponse(input, isRoast) {
  const apiKey = 'WnO0PG/GChvpirQGE3CXeA==5Iyc3aUcaPiOIeZQ';
  const apiUrl = 'https://api.api-ninjas.com/v1/jokes';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const data = await response.json();
    
    // API Ninjas Jokes API returns an array of jokes
    if (!data || !data[0] || !data[0].joke) {
      throw new Error('No valid joke received');
    }
    
    // Add roast flavor if needed
    return isRoast
      ? `${data[0].joke} Also, your "${input}" is so weak, it’d crash Netscape Navigator!`
      : `${data[0].joke} (P.S. Your "${input}" makes my 56k modem cry.)`;
  } catch (error) {
    console.error('API Error:', error.message);
    // Fallback to local response
    const fallback = getRandomItem(isRoast ? roastReplies : dumbReplies);
    return fallback.replace("{input}", input);
  }
}

// Function to handle user input and display response
async function respond(isRoast = false) {
  const userInput = document.getElementById('userInput').value.trim();
  const output = document.getElementById('output');

  // Clear input field
  document.getElementById('userInput').value = '';

  // If input is empty, give a snarky remark
  if (!userInput) {
    output.innerHTML += `<p>> You didn't type anything, genius. My AI’s got better things to do!</p>`;
    output.scrollTop = output.scrollHeight;
    return;
  }

  // Add user input to output
  output.innerHTML += `<p>> You: ${userInput}</p>`;
  
  // Fetch and display AI response
  const response = await fetchAIResponse(userInput, isRoast);
  output.innerHTML += `<p>> DumbBot: ${response}</p>`;
  
  // Scroll to the bottom of the output
  output.scrollTop = output.scrollHeight;
}

// Function for the Quit button
function rageQuit() {
  const output = document.getElementById('output');
  output.innerHTML = `<p>> SYSTEM ERROR: User too lame to continue! Shutting down in 3... 2... 1...</p><p>> *BZZT* DumbBot.exe has crashed! Go reboot your personality!</p>`;
  // Disable input and buttons
  document.getElementById('userInput').disabled = true;
  document.querySelectorAll('.buttons button').forEach(button => button.disabled = true);
}

// Handle Enter key for sending input
document.getElementById('userInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    respond();
  }
});s