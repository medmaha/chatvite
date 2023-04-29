import React, { useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { GlobalContext } from "../../contexts"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Name from "./Name"
import Pending from "../UI/Pending"
import Meta from "../../contexts/Meta"

export default function Verify({ activated }) {
    const formRef = useRef()
    const router = useRouter()

    const [addName, setAddName] = useState(false)
    const [pending, setPending] = useState(false)
    const { user, setUser } = useContext(GlobalContext)

    useEffect(() => {
        if (location.href.match(/(\/verify\?)/g)) {
            if (user?.active && !user.name) {
                setAddName(true)
            }
        }
    }, [user])

    function submitForm(ev) {
        ev.preventDefault()
        const code = ev.target.code?.value
        setPending(true)

        axios
            .post(
                "/api/authenticate/verify",
                { code },
                { withCredentials: true },
            )
            .then(async (res) => {
                if (res.data.message === "Activated") {
                    await axios.get("/api/auth/session?update=1")
                    await router.replace(
                        "/auth/verify?name=empty&token=" + user._id,
                        "",
                        {
                            shallow: true,
                        },
                    )
                    setUser({
                        ...user,
                        active: true,
                    })
                }
            })
            .catch((err) => {
                if (err.response) {
                    console.error(err.response.data.message)
                } else {
                    console.error(err.message)
                }
            })
            .finally(() => {
                setPending(false)
            })
    }

    return (
        <>
            <Meta>
                <title>ChatVite | Verify Your Account</title>
            </Meta>
            {addName || activated || user?.active ? (
                <Name />
            ) : (
                <div className="flex justify-center mt-[50px]">
                    <div className="w-full max-w-[450px] bg-gray-700 p-4 px-8 overflow-hidden rounded-2xl relative">
                        {pending && (
                            <div className="absolute top-0 w-full left-0 h-full bg-black bg-opacity-50 flex justify-center items-start">
                                <Pending h="100%" />
                            </div>
                        )}
                        <h2 className="font-bold text-2xl tracking-wide text-center pb-1">
                            Verify Your Email Address
                        </h2>

                        <p className="text-center max-w-[50ch] text-sm text-gray-300 font-semibold tracking-wide pb-2 leading-5 py-2">
                            Thank you for registering. To continue, we&apos;ve
                            sent a verification code to the email address you
                            provided.
                        </p>
                        <form ref={formRef} method="post" onSubmit={submitForm}>
                            <div className="flex flex-col items-center my-4 py-4 gap-1">
                                <label htmlFor="flex items-center">
                                    <span className="text-lg px-1 font-semibold leading-none">
                                        Verification Code
                                    </span>
                                </label>
                                <input
                                    onKeyDown={() => {}}
                                    type="text"
                                    name="code"
                                    placeholder="123456"
                                    required
                                    className="bg-gray-800 w-[12ch] text-lg text-center rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                                />
                            </div>

                            <div className="flex justify-center py-2 mt-4">
                                <button className="py-2 px-4 transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide">
                                    Confirm
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-1">
                            <div className="mt-1">
                                <p className="text-gray-300 mt-4">
                                    <Link
                                        href={"/auth/login"}
                                        className="text-sky-400 hover:text-blue-500 transition-colors font-semibold p-1 tex-sm "
                                    >
                                        Want to change your email?
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
