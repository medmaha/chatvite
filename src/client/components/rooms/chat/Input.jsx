import React, { useEffect, useLayoutEffect } from "react"

export default function Input({ onSubmit, setOffset }) {
    const padding = 16
    const HEIGHT = 48
    const [height, setHeight] = React.useState(HEIGHT)

    const textareaRef = React.useRef()

    useLayoutEffect(() => {
        setOffset(height + padding)
    }, [height])

    function handleTextareaChange() {
        const element = textareaRef.current

        element.classList.remove("overflow-y-auto")

        const scrollHeight = element.scrollHeight
        // element.style.height = "48px"

        if (scrollHeight > HEIGHT) {
            // element.style.height = "auto"
            const scrollHeight = element.scrollHeight
            if (scrollHeight === 120) {
                setHeight(120)
            } else if (scrollHeight > 120) {
                setHeight(120)
                element.classList.add("overflow-y-auto")
            } else {
                setHeight(scrollHeight)
            }
        } else {
            setHeight(HEIGHT)
        }
    }

    function submitMessage() {
        const message = textareaRef.current.value

        textareaRef.current.blur()

        const cb = () => {
            textareaRef.current.value = ""
            setHeight(HEIGHT)
        }

        onSubmit(message, cb)
    }

    function handleKeyDown(ev) {
        if (ev.key.toLowerCase() === "enter") {
            ev.preventDefault()
            submitMessage()
        }
    }

    return (
        <div className="w-full relative">
            <textarea
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                tabIndex="0"
                name="message"
                onBlur={() => {
                    textareaRef.current.style.height = String(HEIGHT) + "px"
                    setHeight(HEIGHT)
                }}
                // onFocus={handleTextareaChange}
                style={{
                    height: `${height}px`,
                    maxHeight: `${120}px`,
                }}
                onChange={handleTextareaChange}
                placeholder="Write you message here..."
                rows="1"
                className="overflow-hidden w-full text-gray-300 rounded-md ring-0 focus:ring-0 leading-6 focus:outline-none resize-none bg-gray-800 pl-2 pr-8 transition-[border] border border-transparent focus:border-sky-500"
            ></textarea>
            <button
                onClick={submitMessage}
                title="Send"
                className="absolute p-[3px] rounded-md text-gray-500 bottom-[1em] right-1 hover:bg-gray-900"
            >
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    )
}
