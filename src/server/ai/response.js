// import OpenAI from "openai"
const { GoogleGenerativeAI } = require("@google/generative-ai");


// const openai = new OpenAI({
//     apiKey: process.env.OPEN_AI_KEY,
// })

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function getAiResponse(prompt) {
    try {
        // const completion = await openai.chat.completions.create({
        //     messages: [{ role: "system", content: prompt }],
        //     model: "gpt-3.5-turbo",
        // })
        const result = await model.generateContent(prompt);
        
        // const content = completion.choices[0]?.message?.content
        const content = result.response.text()

        if (!content) throw new Error("Wrong setup")
        return content
    } catch (error) {
        return { message: error.message }
    }
}
