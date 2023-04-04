import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function NavBrand() {
    return (
        <div data-nav-brand className="brand inline-flex">
            <h1 className="">
                <Link
                    href="/feed"
                    className="font-bold text-lg tracking-wider inline-flex gap-1 items-center"
                >
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2330 2048"
                            fill="currentColor"
                            width={"1.2em"}
                            height={"1.2em"}
                            stroke="currentColor"
                        >
                            <path
                                transform="scale(4 4) translate(0 0)"
                                d="M491.9 105.9c-77.8-51.4-181.2-63.1-267.1-47.6C128.7-34.4 21 8.2 0 20.5c0 0 73.9 62.8 61.9 117.8-87.5 89.2-45.9 188.5 0 235.4C73.9 428.7 0 491.5 0 491.5c20.8 12.3 128.2 54.8 224.8-37.4 85.7 15.4 189.1 3.8 267.1-47.7 120.6-77 121-223.1 0-300.5zm-194.4 300c-30.1.1-60-3.8-89.1-11.5l-20 19.3c-11.1 10.8-23.6 20.1-37 27.7-16.3 8.2-34.1 13.3-52.3 14.9 1-1.8 1.9-3.6 2.8-5.3 20-37.1 25.4-70.3 16.2-99.8-32.9-25.9-52.6-59-52.6-95.2 0-82.9 103.9-150.1 232-150.1s232 67.2 232 150.1c0 82.9-103.9 149.9-232 149.9zM186.2 291.7c-19.1.3-34.9-15-35.2-34.1-.7-45.9 68.6-46.9 69.3-1.1v.5c.2 19.3-15.5 34.7-34.1 34.7zm74.6-34.1c-.8-45.9 68.5-47 69.3-1.2v.6c.4 45.6-68.5 46.1-69.3.6zm145 34.1c-19.1.3-34.9-15-35.2-34.1-.7-45.9 68.6-46.9 69.3-1.1v.5c.2 19-15 34.6-34.1 34.7z"
                            />
                        </svg>
                    </span>
                    <span>ChatVite</span>
                </Link>
            </h1>
        </div>
    )
}