import React from "react"
import Activity from "./Activity"

export default function ActivityCollections({ activities }) {
    return (
        <div className="max-w-[300]px]">
            {activities.map((activity) => {
                return (
                    <span key={activity._id}>
                        <Activity activity={activity} />
                    </span>
                )
            })}
        </div>
    )
}
