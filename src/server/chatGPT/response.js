const OPENAI_API_URL =
    "https://api.openai.com/v1/engines/text-davinci-003/completions"

const OPENAI_HEADERS = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
}

export default async function getChatGPTResponse(prompt) {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: "post",
            body: JSON.stringify({
                prompt,
                temperature: 0.7,
                max_tokens: 300,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
            headers: OPENAI_HEADERS,
        })

        const data = await response.json()

        if (data.choices?.length) {
            return data.choices[0].text.trim()
        } else {
            throw new Error("Wrong setup")
        }
    } catch (error) {
        return { message: error.message }
    }
}
