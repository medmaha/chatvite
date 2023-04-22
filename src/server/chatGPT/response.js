//
export default async function getChatGPTResponse(prompt) {
    let data

    try {
        const response = await fetch(
            "https://api.openai.com/v1/engines/text-davinci-003/completions",
            {
                method: "post",
                body: JSON.stringify({
                    prompt,
                    temperature: 0.7,
                    max_tokens: 320,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
                },
            },
        )
        data = await response.json()

        if (!!data.choices?.length) {
            data = data.choices[0].text.trim()
        } else {
            console.log(data)
            data = { msg: "wrong setup" }
        }
    } catch (error) {
        data = { message: error.message }
    }
    return data
}
