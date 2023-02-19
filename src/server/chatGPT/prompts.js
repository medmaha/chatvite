//
export function promptHeader(room) {
    const appName = "FuseChat"

    const membersListString = () => {
        const membersList = room.members
            .slice(0, 4)
            .map((member) => member.username)
            .join(", ")

        if (room.members.length > 5) {
            return `${membersList}, and more...`
        } else {
            return membersList
        }
    }

    const prompt = `
Welcome to our group chat on ${appName}, a new startup app.

Our group information includes the group host, which is "${
        room.host.username
    }", the topic of discussion, which is "${
        room.name
    }", under the category of "${
        room.topic.name
    }" and the members of this chat, which are [${membersListString()}]. total is (${
        room.members.length
    }) 
- We ask that you keep the conversation respectful and on-topic.
- To assist with the conversation, we will be using the ChatGPT model.
- Feel free to share your thoughts on the topic, and please note that you might initiate the conversation for yourself.
- A suggestion for users to use the @ symbol to mention other users in the conversation, if needed.

Note for AI model
- When responding, we encourage you to consider the host's perspective. 
- Include the authors when referring to there message.
- Do not generate chat for another user and only respond if the conversation is relevant or if they are directly mentioned.

reminder not generate text for any user

Thank you for helping us maintain a productive and engaging conversation.

`
    return prompt
}

export function buildPromptBody(fuse, room, user = null, intro) {
    let prompt = promptHeader(room)
    let offsetCount = -4
    let moreThanOffsetCount = room.chatfuses.length > 4

    const lastThreeFuses = room.chatfuses.slice(offsetCount)

    if (!intro) {
        if (
            !!lastThreeFuses.length &&
            lastThreeFuses[lastThreeFuses.length - 1]
        ) {
            const lstMsg = lastThreeFuses[lastThreeFuses.length - 1]

            if (lstMsg.sender?.username.toLowerCase() === "ai") return "no-need"
        }
    }

    let foundUserReference = false

    for (const chat of lastThreeFuses) {
        const username = chat.sender.username.toLowerCase()

        if (!fuse) break

        const text = fuse.toLowerCase()

        if (username === "ai" || user?.username.toLowerCase() === username)
            continue

        if (text.match(new RegExp(username))) {
            foundUserReference = true
            break
        }
    }

    if (foundUserReference) return "no-need"

    if (moreThanOffsetCount) {
        prompt += "...\n"
    }
    lastThreeFuses.forEach((chat) => {
        const fuse = (() => {
            if (chat.fuse.length > 100)
                return chat.fuse.substring(0, 100) + "..."
            return chat.fuse
        })()
        prompt += `${chat.sender.username}: ${fuse}\n`
    })

    prompt += `AI:`

    console.log(prompt)
    return prompt
}
