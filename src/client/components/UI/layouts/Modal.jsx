import React, {
    useContext,
    useLayoutEffect,
    useRef,
    useEffect,
    useState,
} from "react"
import { GlobalContext } from "../../../contexts"

let T
let t
let text = "."

export default function Modal({
    title,
    content,
    close,
    onClose,
    actionBtn,
    pending,
    pendingText,
}) {
    const modalRef = useRef()
    const loadingElemRef = useRef()
    const [pendingData, setPendingData] = useState(pending)

    useEffect(() => {
        if (close) {
            closeModal()
            setPendingData(false)
        }
    }, [close])

    useEffect(() => {
        setPendingData(pending)
    }, [pending])

    useEffect(() => {
        if (pendingData) {
            loadingShower()
        }
    }, [pendingData])

    useLayoutEffect(() => {
        const element = modalRef.current

        const timeout = setTimeout(() => {
            element.classList.add("active")
        }, 50)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    function loadingShower() {
        const loadingElem = loadingElemRef.current

        if (t) clearInterval(t)

        console.log(loadingElem)

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

    function closeModal() {
        modalRef.current?.classList.remove("active")
        if (T) {
            clearTimeout(T)
        }
        T = setTimeout(() => {
            onClose()
        }, 510)
    }

    return (
        <div
            style={{ backdropFilter: "blur(5px)" }}
            className="fixed transition top-[65px] left-0 w-full h-[calc(100vh-65px)] bg-transparent z-10"
        >
            <div className="flex justify-center items-center w-full h-full px-2">
                <div
                    ref={modalRef}
                    className="w-full relative max-w-[600px] modal-- overflow-hidden pb-4 min-h-[calc(100vh-250px)] max-h-[calc(100vh-100px)] bg-gray-600 shadow-lg rounded-2xl"
                >
                    {pendingData && (
                        <div className="absolute top-0 left-0 w-full h-full z-20 cursor-wait">
                            <div
                                style={{ backdropFilter: "blur(1px)" }}
                                className="bg-black w-full flex justify-center items-center h-full bg-opacity-50"
                            >
                                <div className="text-3xl font-bold text-gray-300 flex">
                                    <div className="flex-1">
                                        <span className="text-xl inline-block">
                                            {pendingText || "Loading"}
                                        </span>
                                    </div>
                                    <div className="min-w-[30px]">
                                        <span
                                            ref={loadingElemRef}
                                            data-show-loading
                                            className="text-3xl inline-block"
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="py-2 md:py-3 relative p-2 md:p-3">
                        <div className="flex gap-4 items-center justify-between w-[90%] sm:w-[85%]">
                            <h5 className="font-bold text-xl md:text-2xl tracking-wider">
                                {title}
                            </h5>
                            {actionBtn || ""}
                        </div>
                        <div className="absolute right-3 top-2 leading-none">
                            <button
                                onClick={closeModal}
                                className="font-bold inline-flex justify-center leading-[30px] items-center text-lg
                                rounded-full h-[30px] w-[30px] transition hover:bg-gray-800 hover:bg-opacity-30 hover:text-red-400"
                            >
                                <span className="leading-none">x</span>
                            </button>
                        </div>
                    </div>
                    <div className="__content p-2 md:p-3 pb-1 md:pb-1 w-full overflow-hidden overflow-y-auto max-h-[calc(100vh-175px)]">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}
