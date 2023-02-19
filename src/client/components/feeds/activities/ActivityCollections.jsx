import React from "react"
import Activity from "./Activity"

export default function ActivityCollections({ activities }) {
    return (
        <div>
            {activities.map((activity) => {
                return (
                    <span key={activity.id || activity._id}>
                        <Activity activity={activity} />
                    </span>
                )
            })}
        </div>
    )
}
