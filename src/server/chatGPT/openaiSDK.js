import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
})

export async function openAiSDK(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        })

        const content = completion.choices[0]?.message?.content
        return content || null
    } catch (error) {
        return null
    }
}
