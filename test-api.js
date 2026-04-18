import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBmYmWN2T6yv0zNgKcJq1UKBTVhWFQuD40");

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Response:", result.response.text());
  } catch(err) {
    console.error("Gemini Flash Error:", err.message);
    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Say hello");
        console.log("Pro Response:", result2.response.text());
    } catch(err2) {
        console.error("Gemini Pro Error:", err2.message);
    }
  }
}
test();
