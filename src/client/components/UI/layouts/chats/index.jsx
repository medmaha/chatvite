import axios from "axios"
import { useEffect, useLayoutEffect, useReducer, useState } from "react"
import Modal from "../Modal"
import PublicChat from "./Public"
import PrivateChat from "./Private"

export default function HostedChats({ onClose }) {
    const [title, setTitle] = useState("Private")
    const [loading, toggleLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(null)
    const [tabs, updateTabs] = useState({
        public: { data: null, name: "public" },
        private: { data: null, name: "private" },
    })

    useLayoutEffect(() => {
        setActiveTab(tabs.private)
    }, [])
    useLayoutEffect(() => {
        setActiveTab(tabs.private)
    }, [])

    // useLayoutEffect(() => {
    //     if (activeLink && activeTab.data === null){
    //         fetchTabData
    //     }
    // }, [activeLink])

    useEffect(() => {
        const tab = tabs[title.toLowerCase()]

        if (tab && !tab.data) {
            toggleLoading(true)
            fetchTabData(tab.name)
        } else if (!!tab?.data) {
            setActiveTab({ ...tab })
        }
    }, [title])

    async function fetchTabData(tab) {
        try {
            const { data } = await axios.get(`/api/room/chatrooms/${tab}`)
            toggleLoading(false)
            console.log("response:", data)
            updateTabs((prev) => {
                return {
                    ...prev,
                    [tab]: {
                        ...prev[tab],
                        data: data,
                    },
                }
            })
            setActiveTab(() => {
                return {
                    name: tab,
                    data: data,
                }
            })
        } catch (error) {
            toggleLoading(false)
            alert(error.message)
            console.error(error)
        }
    }

    function handleTabChange(ev) {
        const tabButton = ev.currentTarget.dataset.tab
        switch (tabButton) {
            case "public":
                setTitle("Public")
                break
            case "private":
                setTitle("Private")
                break
            default:
                break
        }

        ev.target
            .closest("[data-tab-buttons]")
            .querySelector("button.outline")
            .classList.remove("outline", "text-sky-400")
        ev.currentTarget.classList.add("outline", "text-sky-400")
    }

    return (
        <>
            <Modal
                pending={loading}
                title={`${title} Chats`}
                onClose={onClose}
                content={
                    <div className="w-full h-full block flex-col">
                        <div
                            data-tab-buttons
                            className="flex justify-center items-center gap-4 w-full px-1 pb-2 mb-2 "
                        >
                            <button
                                onClick={handleTabChange}
                                data-tab="private"
                                title="Private Chats"
                                className="transition inline-flex gap-1 items-center outline-[1px] outline outline-sky-400 px-2 text-sky-400 rounded-t-lg hover:text-sky-500"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="currentColor"
                                    >
                                        <path d="M9 8c1.66 0 2.99-1.34 2.99-3S10.66 2 9 2C7.34 2 6 3.34 6 5s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V16h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                </span>
                                <span className="font-semibold">Private</span>
                            </button>
                            <button
                                title="Public Chats"
                                onClick={handleTabChange}
                                data-tab="public"
                                className="transition inline-flex gap-1 items-center outline-[1px] outline-sky-400 px-2 rounded-t-lg hover:text-sky-500"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 18 18"
                                        fill="currentColor"
                                    >
                                        <path d="M9 8c1.11 0 2-.9 2-2s-.89-2-2-2c-1.1 0-2 .9-2 2s.9 2 2 2zm4 0c1.11 0 2-.9 2-2s-.89-2-2-2c-.36 0-.69.1-.98.27.3.51.48 1.1.48 1.73s-.18 1.22-.48 1.73c.29.17.63.27.98.27zM9 9.2c-1.67 0-5 .83-5 2.5V13h10v-1.3c0-1.67-3.33-2.5-5-2.5zM5 7H3V5H2v2H0v1h2v2h1V8h2V7zm9.23 2.31c.75.6 1.27 1.38 1.27 2.39V13H18v-1.3c0-1.31-2.07-2.11-3.77-2.39z" />
                                    </svg>
                                </span>
                                <span className="font-semibold">Public</span>
                            </button>
                        </div>
                        {!!activeTab?.data && (
                            <>
                                {activeTab.name === "public" && (
                                    <PublicChat rooms={activeTab.data} />
                                )}
                                {activeTab.name === "private" && (
                                    <PrivateChat rooms={activeTab.data} />
                                )}
                            </>
                        )}
                    </div>
                }
            />
        </>
    )
}
