import React, { useEffect, useLayoutEffect, useRef } from "react"

export default function Pending({ h }) {
    const ref = useRef()
    useEffect(() => {
        const element = ref.current
    }, [])

    return (
        <div
            ref={ref}
            style={{ height: h || "auto" }}
            className={`relative w-full flex justify-center items-center`}
        >
            <div
                className={`flex justify-center items-center p-2 h-full flex-col `}
            >
                <div
                    className="animate-ping"
                    style={{ animationDuration: "1s" }}
                >
                    <span className="">
                        <svg
                            className="w-[2em] h-[2em]"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2048 2048"
                        >
                            <path d="M1024 0q141 0 272 36.5T1540.5 140t207 160.5 160.5 207T2011.5 752t36.5 272-36.5 272-103.5 244.5-160.5 207-207 160.5-244.5 103.5-272 36.5-272-36.5T507.5 1908t-207-160.5-160.5-207T36.5 1296 0 1024t36.5-272T140 507.5t160.5-207 207-160.5T752 36.5 1024 0zm0 1792q106 0 204-27.5t183.5-77.5 155.5-120 120-155.5 77.5-183.5 27.5-204-27.5-204-77.5-183.5T1567 481t-155.5-120-183.5-77.5-204-27.5-204 27.5T636.5 361 481 481 361 636.5 283.5 820 256 1024t27.5 204 77.5 183.5T481 1567t155.5 120 183.5 77.5 204 27.5z" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}
