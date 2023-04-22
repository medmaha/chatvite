//
export function promptHeader(room, host, isPrivate = false) {
    const appName = "ChatVite"

    const membersListString = () => {
        const membersList = room.members
            .slice(0, 4)
            .map((member) => {
                if (member.name === "AI") return "AI"
                return member.username
            })
            .join(", ")

        if (room.members.length > 5) {
            return `${membersList}, and more...`
        } else {
            return membersList
        }
    }

    const intro = (() => {
        if (isPrivate)
            return `
Welcome to our Chatroom on ${appName}, a new startup app.
App is developed and maintain by Mahamed Toure a dedicated self-taught full-stack developer

This room is a one to one private chat between ${host.username} and AI.
Our chat room's information includes the topic of discussion, which is "${room.name}", under the category of "${room.topic.name}".
Note: ${host.username} is the Host/Author of this Chat Room`

        return `
Welcome to our group chat on ${appName}, a new startup app.
App is developed and maintain by Mahamed Toure a dedicated self-taught full-stack developer

Our group information includes the group host, which is "${
            room.username
        }", the topic of discussion, which is "${
            room.name
        }", under the category of "${
            room.topic.name
        }" and the members of this chat, which are [${membersListString()}]. total is (${
            room.members.length
        })`
    })()

    const prompt = `
${intro}

- We ask that you keep the conversation respectful and on-topic.
- A suggestion for users to use the @ symbol to mention other users in the conversation, if needed.
- please please please! Stay on topic encourage each other to stay on topic

Note for AI model
- To assist with the conversation, we will be using the ChatGPT model.
- You might initiate the conversation.
- Feel free to share your thoughts on the topic.
- When responding, we encourage you to consider the host's perspective. 
- Include the authors when referring to there message.
- Make sure you don't go off topic, and encourage each other to stay on topic
${
    !isPrivate
        ? `- Remind other members to stay on topic
- Take note of the members list and consider the count when responding`
        : ""
}

Thank you for helping us maintain a productive and engaging conversation.
`
    return prompt
}

export function buildPromptBody(fuse, room, user = null, intro) {
    let prompt = promptHeader(room, room.host, room.isPrivate)
    let offsetCount = -5
    let moreThanOffsetCount = room.chatfuses.length > 4

    const lastThreeChats = room.chatfuses.slice(offsetCount)

    if (!intro) {
        if (
            !!lastThreeChats.length &&
            lastThreeChats[lastThreeChats.length - 1]
        ) {
            const lstMsg = lastThreeChats[lastThreeChats.length - 1]

            if (lstMsg.sender?.username.toLowerCase() === "ai") return "no-need"
        }
    }

    let foundUserReference = false

    for (const chat of lastThreeChats) {
        const name = chat.sender.name.toLowerCase()

        if (!fuse) break

        const text = fuse.toLowerCase()

        if (name === "ai" || user?.name.toLowerCase() === name) continue

        if (text.match(new RegExp(name))) {
            foundUserReference = true
            break
        }
    }

    if (foundUserReference) return "no-need"

    if (moreThanOffsetCount) {
        prompt += "...\n"
    }
    lastThreeChats.forEach((chat) => {
        const fuse = (() => {
            if (chat.fuse.length > 100)
                return chat.fuse.substring(0, 100) + "..."
            return chat.fuse
        })()

        if (chat.sender.name === "AI") {
            prompt += `${chat.sender.name}: ${fuse}\n`
        } else {
            prompt += `${chat.sender.username}: ${fuse}\n`
        }
    })

    prompt += `AI:`

    return prompt
}
