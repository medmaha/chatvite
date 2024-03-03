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
App is developed and maintain by Mahamed Toure self-taught full-stack developer.
Mahamed Toure's portfolio link is https://porfolio-mahamed.vercel.app

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
