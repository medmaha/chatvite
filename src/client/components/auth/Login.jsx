import Link from "next/link"
import React from "react"
import { signIn, useSession } from "next-auth/react"

export default function Login() {
    const session = useSession()

    console.log(session)
    async function handleLogin(ev) {
        ev.preventDefault()

        const email = ev.target.email.value.trim()
        const password = ev.target["current-password"].value.trim()

        if (!email || !password) return alert("Error")

        const user = await signIn("credentials", {
            email,
            password,
        })

        alert(user)
    }

    return (
        <div className="w-full max-w-[450px] bg-gray-700 p-4 px-8 rounded-2xl">
            <h2 className="font-bold text-2xl tracking-wide text-center pb-1">
                WeChat
            </h2>
            <p className="text-center text-sm text-gray-300 font-semibold tracking-wide pb-2">
                Find your chat partner
            </p>
            <form className="" method="post" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1 mb-3">
                    <label htmlFor="flex items-center">
                        <span className="text-lg px-1 font-semibold leading-none">
                            Email
                        </span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                </div>
                <div className="flex flex-col gap-1 mb-3">
                    <label htmlFor="flex items-center">
                        <span className="text-lg px-1 font-semibold leading-none">
                            Password
                        </span>
                    </label>
                    <input
                        name="current-password"
                        required
                        type="password"
                        className="bg-gray-800 rounded-lg py-3 px-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    />
                </div>

                <div className="flex justify-end py-2">
                    <button className="py-2 w-full transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide">
                        Login
                    </button>
                </div>
            </form>
            <div className="flex gap-2 items-center mt-2">
                <span className="divider"></span>
                <span className="text-lg text-gray-400 font-bold">OR</span>
                <span className="divider"></span>
            </div>
            <div className="text-center mt-1">
                <p className="text-sky-400 pb-2 font-bold tracking-wide">
                    <button>Forgot Password?</button>
                </p>
                <div className="mt-1">
                    <p className="text-gray-300">
                        don&apos;t have an account?{" "}
                        <Link
                            href={"/auth/signup"}
                            className="text-sky-400 font-semibold p-1 border-b border-solid border-current"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
