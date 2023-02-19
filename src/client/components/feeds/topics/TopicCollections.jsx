import React from "react"
import Topic from "./Topic"

export default function TopicCollections({ topics, subscribe, user }) {
    return (
        <div>
            {topics.map((topic) => {
                return (
                    <span key={topic._id || topic.id}>
                        <span className="divider"></span>
                        <Topic
                            topic={topic}
                            subscribe={subscribe}
                            user={user}
                        />
                    </span>
                )
            })}
        </div>
    )
}
