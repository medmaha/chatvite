import React, { useEffect, useRef } from "react"

let t
let text = "."

export default function Form({ loading, handleFormSubmit }) {
    const formRef = useRef()

    useEffect(() => {
        if (loading) loadingShower()
    }, [loading])

    function loadingShower() {
        const loadingElem = formRef.current.querySelector("[data-show-loading]")
        if (t) clearInterval(t)

        t = setInterval(() => {
            if (text.length > 2) {
                text = ""
                loadingElem.innerHTML = text
            } else {
                text += "."
                loadingElem.innerHTML = text
            }
        }, 500)
    }

    return (
        <div ref={formRef} className=" h-full min-h-max">
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full z-20 cursor-wait">
                    <div className="bg-black w-full flex justify-center items-center h-full bg-opacity-50">
                        <div className="text-3xl font-bold text-gray-300">
                            <span className="text-xl">Creating</span>
                            <span data-show-loading className="text-3xl"></span>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={handleFormSubmit} className="relative">
                <div className="flex flex-col gap-1 mb-3">
                    <label htmlFor="flex items-center">
                        <span className="text-lg font-semibold">Topic</span>
                        <span className="text-sky-400 px-1" title="required">
                            *
                        </span>
                    </label>
                    <input
                        type="text"
                        name="topic"
                        required
                        placeholder="topic of discussion"
                        className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                    <p className="text-xs tracking-wide truncate px-1 text-gray-400">
                        Topic will be created, if it does not exist
                    </p>
                </div>
                <div className="flex flex-col gap-1 mb-3">
                    <label htmlFor="flex items-center">
                        <span className="text-lg font-semibold">Room Name</span>
                        <span className="text-sky-400 px-1" title="required">
                            *
                        </span>
                    </label>
                    <input
                        name="room"
                        required
                        type="text"
                        placeholder="a unique name"
                        className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                </div>
                <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="flex items-center">
                        <span className="text-lg font-semibold">
                            Room Description
                        </span>
                        <span
                            className="text-gray-400 px-1 text-sm"
                            title="optional"
                        >
                            {"(optional)"}
                        </span>
                    </label>

                    <textarea
                        name="description"
                        placeholder="about this room"
                        className="bg-gray-800 h-[100px] resize-none rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                    <button className="py-2 px-4 transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide">
                        Create Chat
                    </button>
                </div>
            </form>
        </div>
    )
}
