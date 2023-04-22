import axios from "axios"
import React, { useRef, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import Username from "./Username"
import Email from "./Email"
import Password from "./Password"
import Pending from "../../UI/Pending"

export default function Signup({ csrfToken }) {
    const formRef = useRef()
    const router = useRouter()

    const [error, setError] = useState({})
    const [pending, setPending] = useState(false)

    function submitForm(ev) {
        ev.preventDefault()

        const data = new FormData(ev.target)
        setPending(true)
        axios
            .post("/api/authenticate/signup", data, {
                headers: { "content-type": "application/json" },
                withCredentials: true,
            })
            .then(async (res) => {
                console.log(res.data)

                const login = await signIn("credentials", {
                    csrfToken,
                    email: data.get("email"),
                    "current-password": data.get("password"),
                    redirect: false,
                })

                if (login.ok) {
                    router.replace("/auth/verify")
                }
                if (login.error) {
                    alert(login.error)
                }
            })
            .catch((err) => {
                if (err.response) {
                    handleError(err.response.data)
                }
                console.error(err.response?.data.message || err.message)
            })
    }

    function handleError(error) {
        // console.log(error)

        setError({ [error.path]: error.message })

        const target = formRef.current[error.path]

        target.classList.remove("focus:border-sky-500", "border-gray-700")
        target.classList.add("focus:border-red-400", "border-red-400")
    }

    return (
        <div className="flex justify-center mt-4">
            <div className="w-full relative overflow-hidden max-w-[450px] bg-gray-700 p-4 px-8 rounded-2xl">
                {pending && (
                    <div className="absolute top-0 w-full left-0 h-full bg-black bg-opacity-50 flex justify-center items-start">
                        <Pending h="100%" />
                    </div>
                )}
                <h2 className="font-bold text-2xl tracking-wide text-center pb-1">
                    ChatVite
                </h2>
                <p className="text-center text-sm text-gray-300 font-semibold tracking-wide pb-2">
                    Explore your chat experience
                </p>
                <form
                    ref={formRef}
                    method="post"
                    onSubmit={submitForm}
                    onInput={() => {
                        if (error) {
                            setError(false)
                        }
                    }}
                >
                    <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                    />

                    <Email errorMsg={error?.email} />
                    <Username errorMsg={error?.username} />
                    <Password errorMsg={error?.password} />

                    <div className="flex justify-end py-2">
                        <button className="py-2 w-full transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide">
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center mt-1">
                    <div className="mt-1">
                        <p className="text-gray-300 mt-4">
                            Already have an account?{" "}
                            <Link
                                href={"/auth/login"}
                                className="text-sky-400 font-semibold p-1 border-b border-solid border-current"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
