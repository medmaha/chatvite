import { useEffect, useState } from "react"
import ActivityCollections from "./ActivityCollections"
import { Footer } from "../../UI/layouts"
import axios from "axios"
import Pending from "../../UI/Pending"

export default function Activities() {
    const [activities, setActivities] = useState(false)

    useEffect(() => {
        fetchActivities()
    }, [])

    function fetchActivities() {
        axios
            .get("/api/activity/list", { credentials: true })
            .then((res) => {
                setActivities(res.data)
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
                <div className="max-h-[calc(100svh-135px)] overflow-hidden overflow-y-auto h-full mt-1">
                    {activities ? (
                        <ActivityCollections activities={activities} />
                    ) : (
                        <Pending h={"400px"} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
