import React, { useEffect, useRef, useState } from "react"

export default function Popup(props) {
    const popupRef = useRef(document.createElement("div"))
    const [config, updateConfig] = useState({ ...props, popupRef })

    const { autoOpen, content, onConfirm, onClose } = config

    useEffect(() => {
        updateConfig((prev) => ({ ...prev, popupRef }))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            {autoOpen && (
                <div
                    ref={popupRef}
                    className="fixed inset-0 flex items-center justify-center p-6 z-[50]"
                >
                    <div className="bg-slate-300 w-full max-w-[400px] rounded-lg p-6 flex flex-col gap-4 outline-2 outline-red-400 outline">
                        <p className="max-w-[45ch] text-slate-800 text-center tracking-wide">
                            {content}
                        </p>
                        <div className="mt-2 flex gap-4 justify-end">
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                onClick={() => {
                                    function cb(config) {
                                        updateConfig({ ...config })
                                    }
                                    onConfirm(config, cb)
                                }}
                            >
                                {props.confirmBtnText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

Popup.defaultProps = {
    autoOpen: true,
    onClose: () => {},
    onConfirm: (config) => {},
    confirmBtnText: "Ok",
    content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, incidunt?",
}
