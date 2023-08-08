import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { GlobalContext } from "../../../contexts"

export default function SearchBar() {
    const [showSearchForm, setShowSearchBar] = useState(null)
    const { user } = useContext(GlobalContext)

    const router = useRouter()

    const brandElm = useRef()
    const profileElm = useRef()

    function awaitExit(ev) {
        const inputQueryFieldClicked =
            !!ev.target.dataset.queryField ||
            !!ev.target.closest("[data-query-field]")
        const initQueryBtnClicked =
            !!ev.target.dataset.initQuery ||
            !!ev.target.closest("[data-init-query]")
        const exitQueryBtnClicked =
            !!ev.target.dataset.exitQuery ||
            !!ev.target.closest("[data-exit-query]")
        const searchQueryBtnClicked =
            !!ev.target.dataset.searchQuery ||
            !!ev.target.closest("[data-search-query]")

        if (
            !inputQueryFieldClicked &&
            !exitQueryBtnClicked &&
            !searchQueryBtnClicked &&
            !initQueryBtnClicked
        )
            toggleSearch()
    }

    useEffect(() => {
        if (showSearchForm) {
            const input = document.querySelector(
                "nav .search-bar [data-mobile-search] input",
            )
            if (input) input.focus()
            document.addEventListener("click", awaitExit)
            return () => document.removeEventListener("click", awaitExit)
        }
    }, [showSearchForm])

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
        <div className="max-w-[420px] flex-1 gap-1 flex justify-end sm:justify-start h-full items-center search-bar">
            {/* Desktop searchBar */}
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

            {/* Mobile searchBar */}
            {showSearchForm && (
                <form
                    data-mobile-search
                    onSubmit={handleSearch}
                    className="form w-full inline-block relative flex-1"
                >
                    <input
                        type="search"
                        data-query-field
                        // onBlur={toggleSearch}
                        placeholder="Search"
                        name="search"
                        tabIndex={1}
                        className="bg-gray-800 rounded-md w-full p-2 border-gray-600 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                    <button
                        title="search"
                        type="button"
                        data-search-query
                        onClick={handleSearch}
                        className="absolute right-0 h-full inline-flex items-center px-2 "
                    >
                        <svg
                            data-search-query
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

            <div className="self-end sm:hidden h-full flex items-center">
                {!showSearchForm && !!user ? (
                    <button
                        data-init-query
                        title="search"
                        className="inline-flex hover:text-blue-400 transition text-gray-400 border-gray-400 gap-2 items-center border-2 hover:border-blue-400 px-4 rounded-md py-1 text-sm"
                        onClick={toggleSearch}
                    >
                        <span data-init-query className="">
                            Search
                        </span>
                        <svg
                            data-init-query
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </button>
                ) : (
                    !!user && (
                        <button
                            className="bg-red-400 w-7 h-7 inline-flex items-center justify-center rounded-full bg-opacity-40 hover:bg-opacity-40 transition"
                            title="close"
                            data-exit-query
                            onClick={toggleSearch}
                        >
                            <svg
                                data-exit-query
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                            >
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                            </svg>
                        </button>
                    )
                )}
            </div>
        </div>
    )
}
