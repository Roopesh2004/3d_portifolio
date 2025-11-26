const apiKey = "AIzaSyAzgfPZaawTOyOjT4KjwnkrOSXRkIejyuQ";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function test() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            console.log("Available Chat Models:");
            chatModels.forEach(m => console.log(m.name));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
