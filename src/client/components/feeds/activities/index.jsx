import React, { useEffect, useState } from "react"
import ActivityCollections from "./ActivityCollections"
import { Footer } from "../../UI/layouts"

export default function Activities() {
    const [activities, setActivities] = useState([])

    useEffect(() => {
        fetchActivities()
    }, [])

    function fetchActivities() {
        fetch("/api/activity/list", { credentials: "include", method: "post" })
            .then((res) => res.json())
            .then((data) => {
                setActivities(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="sticky top-[0]">
            <div className="bg-gray-700 rounded-md overflow-hidden pb-2">
                <div className="bg-gray-600 p-2 ">
                    <h3 className="text-lg font-semibold tracking-wide">
                        Activities
                    </h3>
                </div>
                <div className="p-2 max-h-[calc(100vh-135px)] overflow-hidden overflow-y-auto h-full mt-1">
                    <ActivityCollections activities={activities} />
                </div>
            </div>
            <Footer />
        </div>
    )
}
