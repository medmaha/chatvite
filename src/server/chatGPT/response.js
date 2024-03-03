import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
})

export async function getChatGPTResponse(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        })

        const content = completion.choices[0]?.message?.content

        if (!content) throw new Error("Wrong setup")
        return content
    } catch (error) {
        return { message: error.message }
    }
}
