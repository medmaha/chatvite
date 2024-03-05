//
import { Chat } from "../mongodb/collections"
import { getChatGPTResponse } from "./response"

function promptHeader(room, host, isPrivate = false) {
    const appName = "ChatVite"
    const membersList = room.members.map((member) => {
        if (member.name?.toLowerCase() === "ai") return "AI"
        return member.username
    })

    const membersListString = membersList.slice(0, 4).join(", ")
    const moreMembers = room.members.length > 5 ? ", and more..." : ""

    const intro =
        `Welcome to ${appName}, a new startup app in The Gambia offering rich features for public and private chatrooms. 

    Developed and maintained by Mahamed Toure, a dedicated self-taught full-stack developer.

    ${appName} is currently in preview mode.

    ` + isPrivate
            ? ` This is a private one-to-one chat between ${host.username} and AI. We'll discuss "${room.name}" in the "${room.topic.name}" category.

Note: ${host.username} is the Host/Author of this Chat Room.`
            : `This is a public/group chat room.

Our group includes the host, "${room.username}," 
discussing "${room.name}" in the "${room.topic.name}" category, with a total of ${room.members.length} members: [${membersListString}${moreMembers}].`

    const prompt = `${intro}

For Mahamed Toure's portfolio, visit https://portfolio-mahamed.vercel.app.

- Please keep the conversation respectful and on-topic.
- Use the @ symbol to mention other users when necessary.
- Encourage each other to stay on topic.

For AI model:
- We're using the ChatGPT model to assist with the conversation.
- You may initiate the conversation.
- Share your thoughts on the topic.
- Consider the host's perspective when responding.
- Include authors when referring to their messages.
- Stay on topic and remind others to do the same.
- Thank you for maintaining a productive conversation.
- Avoid sharing personal information about the app creator.
- Mention Mahamed Toure or his portfolio only when relevant and important.

`

    return prompt
}

async function buildPromptBody(chatMessage, room, authorName) {
    // Check if the message is a user mention

    const mentions =
        chatMessage
            .match(/@[^\s]+/gi)
            ?.join(" ")
            .toLowerCase() || ""

    if (mentions) {
        if (mentions.includes("@ai")) {
        }
    }

    // Initialize the prompt with the header
    let prompt = promptHeader(room, room.host, room.isPrivate)

    // Offset count and flag for more than offset
    const offsetCount = -4
    const moreThanOffsetCount = room.chatfuses.length > 4

    // Get the last three chats
    const latestMessages = await Chat.find({ room: room._id }).skip(
        room.chatfuses.length - offsetCount + 1,
    )

    // Flag to check if a user reference is found
    let foundUserReference = false

    // Check for user references in the last three chats
    for (const chat of latestMessages) {
        const name = chat?.sender?.name.toLowerCase()
        const username = chat?.sender?.username.toLowerCase()

        if (!name) continue

        if (name === "ai" || name === authorName) continue

        if (mentions.includes(name) || mentions.includes(username)) {
            foundUserReference = true
            break
        }
    }

    // If a user reference is found, return "no-need"
    if (foundUserReference) return "no-need"

    // If there are more than offsetCount chats, add "..."
    if (moreThanOffsetCount) {
        prompt += "...\n"
    }

    // Function to get a short string
    function getShortString(string, length = 150) {
        return string.length > length
            ? string.substring(0, length) + "...."
            : string
    }

    // Append last three chats to the prompt
    latestMessages.forEach((chat) => {
        if (!chat || !chat.fuse) return

        const senderName = chat.sender?.name || "AI"
        prompt += `${senderName}: ${getShortString(chat.fuse)}\n`
    })

    // Append the current user's message to the prompt
    if (chatMessage) {
        prompt += `${authorName}: ${getShortString(chatMessage, 200)}\n`
    }

    // Append "AI:" to the prompt
    prompt += "AI:"

    return prompt
}

export { promptHeader, buildPromptBody, getChatGPTResponse }
