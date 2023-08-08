import React from "react"
import Activities from "../../src/client/components/feeds/activities"
import { useRouter } from "next/router"

export default function Index() {
    const router = useRouter()
    return (
        <div className="pb-8 pt-4 mx-auto max-w-[500px]">
            <button title="Back" onClick={() => router.back()} className="ml-4">
                <span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-blue-400"
                    >
                        <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
                    </svg>
                </span>
            </button>
            <Activities />
        </div>
    )
}
