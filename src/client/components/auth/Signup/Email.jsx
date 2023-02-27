import React from "react"

export default function Email({ errorMsg }) {
    const emailRef = React.useRef()

    React.useEffect(() => {
        if (!errorMsg) {
            colorBorders("r")
        }
    }, [errorMsg])

    function colorBorders(action) {
        const inputElement = emailRef.current
        switch (action) {
            case "a":
                inputElement.classList.remove(
                    "focus:border-sky-500",
                    "border-gray-700",
                )
                inputElement.classList.add(
                    "focus:border-red-400",
                    "border-red-400",
                )
            case "r":
                inputElement.classList.remove(
                    "focus:border-red-400",
                    "border-red-400",
                )
                inputElement.classList.add(
                    "focus:border-sky-500",
                    "border-gray-700",
                )
                break
            default:
                break
        }
    }

    return (
        <div className="flex flex-col mb-3">
            <label
                htmlFor="email"
                className="inline-flex items-center justify-between"
            >
                <span className="text-lg px-1 font-semibold leading-none">
                    Email
                </span>
                <span
                    className={`text-${
                        errorMsg ? "red" : "gray"
                    }-400 text-xs truncate px-2`}
                >
                    {errorMsg}
                </span>
            </label>
            <input
                ref={emailRef}
                type="email"
                name="email"
                id="email"
                placeholder="example@abc.com"
                required
                className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
            />
        </div>
    )
}
