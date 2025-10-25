const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

async function sendMessage(message) {
    appendMessage(message, "user");

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("bot-typing");
    typingDiv.textContent = "Bot is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        chatBox.removeChild(typingDiv);

        appendMessage(data.reply, "bot");
    } catch (err) {
        console.error(err);
        chatBox.removeChild(typingDiv);
        appendMessage("Error: Could not get response.", "bot");
    }
}

function appendMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");
    msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
        userInput.value = "";
    }
});

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});
