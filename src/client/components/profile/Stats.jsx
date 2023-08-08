import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../contexts"
import axios from "axios"

export default function Stats({ stats, username }) {
    const [statistics, setStatistics] = useState([])

    useEffect(() => {
        console.log(stats)
        setStatistics(Object.values(stats))
    }, [stats, username])

    return (
        <>
            <div className="mt-4">
                <div className="flex justify-center flex-wrap items-center gap-2">
                    {statistics.map((phase, idx) => {
                        return (
                            <span key={idx} className=" bg-gray-700 rounded-md">
                                <button
                                    className={`rounded-md overflow-hidden bg-blue-500 cursor-default bg-opacity-[0.1%] inline-flex gap-2 items-center`}
                                >
                                    <span
                                        className={`bg-block w-full h-full  py-1 px-2`}
                                    >
                                        <span className="text-gray-300 pr-1 text-base">
                                            {phase.name}
                                        </span>
                                        <span className="text-gray-300 pl-1 font-bold text-sm">
                                            {phase.stats}
                                        </span>
                                    </span>
                                </button>
                            </span>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
