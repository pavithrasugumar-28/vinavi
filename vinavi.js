const API_KEY = "AIzaSyBJY2pmh_GU4MYZV1qwY4iIa0I4dRPDzXU";  
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const chatbox = document.querySelector(".chatbox");

// Show/Hide chatbot with smooth animation
chatbotToggler.addEventListener("click", () => {
    chatbox.style.display = "block";
    setTimeout(() => chatbox.classList.add("fade-in"), 10);
});

closeChatbot.addEventListener("click", () => {
    chatbox.classList.remove("fade-in");
    setTimeout(() => (chatbox.style.display = "none"), 300);
});

// Send message on button click
sendMessage.addEventListener("click", sendUserMessage);

// Send message on Enter key press
messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendUserMessage();
    }
});

// Function to handle sending user message
function sendUserMessage() {
    let userMessage = messageInput.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, "user");
    messageInput.value = "";
    generateBotResponse(userMessage);
}

// Display message in chat
function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Send request to API and get response
async function generateBotResponse(userMessage) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMessage }]}]
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || "API Error");

        const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I'm not sure how to respond. 🤔";
        displayMessage(apiResponseText, "bot");
    } catch (error) {
        console.error("Error:", error.message);
        displayMessage("Oops! Something went wrong. Try again later. 😔", "bot");
    }
}

/* ===== Floating Tamil Letters Animation using Canvas ===== */
const canvas = document.getElementById("floatingCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tamilLetters = ["அ", "ஆ", "இ", "உ", "எ", "ஒ", "ஔ", "ந", "ம", "ழ", "ஃ", "க", "ச", "ட", "த", "ப", "ற"];
let floatingLetters = [];

class FloatingLetter {
    constructor(x, y, speed, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.text = tamilLetters[Math.floor(Math.random() * tamilLetters.length)];
        this.opacity = Math.random() * 0.5 + 0.5; // Random opacity
    }

    update() {
        this.y -= this.speed;
        if (this.y < -50) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.font = `${this.size}px Poppins, sans-serif`;
        ctx.fillStyle = `rgba(255, 146, 179, ${this.opacity})`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

// Create initial floating letters
for (let i = 0; i < 20; i++) {
    floatingLetters.push(new FloatingLetter(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 0.5, // Speed between 0.5 and 2.5
        Math.random() * 30 + 20 // Font size between 20px and 50px
    ));
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    floatingLetters.forEach((letter) => {
        letter.update();
        letter.draw();
    });
    requestAnimationFrame(animate);
}

// Resize canvas if window resizes
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start animation
animate();
