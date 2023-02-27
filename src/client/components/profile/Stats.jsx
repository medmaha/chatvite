import { useEffect, useState } from "react"

export default function Stats({ stats }) {
    const [data, setData] = useState([])

    useEffect(() => {
        setData(stats)
    }, [stats])

    return (
        <>
            <div className="mt-4">
                <div className="flex justify-center flex-wrap items-center gap-2">
                    {data.map((phase, idx) => {
                        return (
                            <button
                                key={idx}
                                className={`rounded-md inline-flex gap-2 items-center py-1 px-2  bg-gray-700 ${
                                    phase.name === "Followers"
                                        ? "hover:bg-blue-500 transition"
                                        : "cursor-default"
                                }`}
                            >
                                <span className="text-gray-300  text-base">
                                    {phase.name}
                                </span>
                                <span className="text-gray-300 font-bold text-sm">
                                    {phase.stats}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
