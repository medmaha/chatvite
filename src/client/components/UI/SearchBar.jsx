import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"

export default function SearchBar() {
    const [showSearch, setShowSearchBar] = useState(null)

    const router = useRouter()

    const brandElm = useRef()
    const profileElm = useRef()

    useEffect(() => {
        brandElm.current = document.querySelector("nav [data-nav-brand]")
        profileElm.current = document.querySelector("nav [data-nav-profile]")
        setShowSearchBar(false)
    }, [])

    function handleSearch(ev) {
        if (ev.preventDefault) ev.preventDefault()

        const form = ev.currentTarget.closest("form") || ev.currentTarget
        const search = form.search.value

        if (search.length < 1) return

        router.push("/feed?search=" + search, "", { shallow: true })
    }

    function toggleSearch() {
        setShowSearchBar((prev) => {
            const toggle = !prev
            brandElm.current.classList.toggle("hidden", toggle)
            profileElm.current.classList.toggle("hidden", toggle)
            return toggle
        })
    }

    return (
        <div className="max-w-[400px] flex-1 flex justify-end sm:justify-start h-full items-center">
            <form
                onSubmit={handleSearch}
                className="form w-full  hidden sm:inline-block relative"
            >
                <input
                    type="search"
                    placeholder="Search"
                    name="search"
                    className="bg-gray-800 rounded-md w-full p-2 border-gray-600 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                />
                <button
                    title="search"
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-0 h-full inline-flex items-center px-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </button>
            </form>

            {showSearch && (
                <form
                    onSubmit={handleSearch}
                    className="form w-full inline-block relative"
                >
                    <input
                        type="search"
                        placeholder="Search"
                        name="search"
                        className="bg-gray-800 rounded-md w-full p-2 border-gray-600 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                    <button
                        title="search"
                        type="button"
                        onClick={handleSearch}
                        className="absolute right-0 h-full inline-flex items-center px-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </button>
                </form>
            )}

            <div className="self-end sm:hidden px-2 h-full flex items-center">
                {!showSearch ? (
                    <button title="search" onClick={toggleSearch}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </button>
                ) : (
                    <div className="inline-flex items-center sm:hidden h-full">
                        <button
                            className="bg-red-400 p-1 rounded-full bg-opacity-30 hover:bg-opacity-40 transition"
                            title="close"
                            onClick={toggleSearch}
                        >
                            <svg
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                            >
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
