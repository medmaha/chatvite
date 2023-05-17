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
Welcome to our Chatroom on ${appName}, a new startup app that provides a rich set of features for both public and private chatrooms.
App is developed and maintain by Mahamed Toure self-taught full-stack developer.
Mahamed Toure's portfolio link is https://portfolio-mahamed.vercel.app
${appName} is in preview state amd production

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
- Thank you for helping us maintain a productive and engaging conversation.

`
    return prompt
}

export function buildPromptBody(chatMessage, room, authorName) {
    let prompt = promptHeader(room, room.host, room.isPrivate)
    let offsetCount = -5
    let moreThanOffsetCount = room.chatfuses.length > 4

    const lastThreeChats = room.chatfuses.slice(offsetCount)

    // if (!intro) {
    //     if (
    //         !!lastThreeChats.length &&
    //         lastThreeChats[lastThreeChats.length - 1]
    //     ) {
    //         const lstMsg = lastThreeChats[lastThreeChats.length - 1]

    //         if (lstMsg.sender?.username.toLowerCase() === "ai") return "no-need"
    //     }
    // }

    let foundUserReference = false

    for (const chat of lastThreeChats) {
        if (!chat || !chat.sender?.name) continue
        const name = chat.sender?.name.toLowerCase()

        if (!chatMessage) break

        const text = chatMessage.toLowerCase()

        if (name === "ai" || chat.sender?.name.toLowerCase() === name) continue

        if (text.match(new RegExp(name))) {
            foundUserReference = true
            break
        }
    }

    if (foundUserReference) return "no-need"

    if (moreThanOffsetCount) {
        prompt += "...\n"
    }

    function getShortString(string, length = 100) {
        if (string.length > length) return string.substring(0, length) + "...."

        return string
    }

    lastThreeChats.forEach((chat) => {
        const fuse = (() => {
            if (!!!chat.fuse?.length) return
            return getShortString(chat.fuse)
        })()

        if (!!fuse) {
            if (!chat.sender) {
            } else if (chat.sender.name === "AI") {
                prompt += `${chat.sender.name}: ${fuse}\n`
            } else {
                prompt += `${chat.sender.username}: ${fuse}\n`
            }
        }
    })

    if (!!chatMessage.length) {
        prompt += `${authorName}: ${getShortString(chatMessage, 200)}\n`
    }
    prompt += `AI:`

    console.log(prompt)
    return prompt
}
