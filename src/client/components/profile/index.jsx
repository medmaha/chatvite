import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSession, getSession } from "next-auth/react"

import Header from "./Header"
import Stats from "./Stats"
import Activities from "./Activities"
import TopicAndRooms from "./Topic&Rooms"
import EditProfile from "./edit"
import axios from "axios"
import { useRouter } from "next/router"
import { GlobalContext } from "../../contexts"
import { updateToFirebase } from "./updateToFirebase"
import Meta from "../../contexts/Meta"

export default function ProfileAccount({ data }) {
    const [edit, toggleEdit] = useState(false)
    const [account, setAccount] = useState({})

    const { user, setUser } = useContext(GlobalContext)

    const collectionRef = useRef()
    const profileRef = useRef()

    const router = useRouter()

    useLayoutEffect(() => {
        console.log(data)
        const element = collectionRef.current
        let startPos = element.getBoundingClientRect().y

        // element.style.setProperty(
        //     "--max-height",
        //     `calc((100vh - ${startPos}px) + (${Math.floor(
        //         startPos / 2,
        //     )}px + 5rem))`,
        // )
    }, [])

    useLayoutEffect(() => {
        setAccount({ ...data.account })
    }, [data])

    useEffect(() => {
        if (account) {
        }
    }, [account])

    async function updatedUserSession(data, cb) {
        await axios.get("/api/auth/session?update=1")
        await getSession()
        router.replace("/profile/" + data.username, "", { shallow: true })
        cb()
        setUser((prev) => {
            return {
                ...prev,
                name: data.name,
                avatar: data.avatar,
                username: data.username,
            }
        })
    }

    async function submitEditForm(data, cb) {
        if (!user?._id) {
            router.push("/auth/login")
            return
        }
        // return updatedUserSession()
        if (localStorage.getItem("avatar-edt")) {
            const url = await updateToFirebase(user)
            data["avatar"] = url
        }

        axios
            .put(
                "/api/profile/update",
                { ...data, userId: user?._id },
                { withCredentials: true },
            )

            .then(async (res) => {
                setAccount(res.data)
                updatedUserSession(res.data, cb)
            })
            .catch((err) => {
                console.log(err.message)
                cb(true)
            })
    }

    return (
        <>
            <Meta>
                <title>
                    {(account.name || account.username) +
                        " | Account - ChatVite"}
                </title>
            </Meta>
            <div
                ref={profileRef}
                className="sticky top-[-88px] w-full h-full block pb-1"
            >
                <Header account={account} toggleEdit={toggleEdit} />
                <Stats stats={data.stats} profileId={account._id} />

                {edit && (
                    <EditProfile
                        submitForm={submitEditForm}
                        account={account}
                        toggleEdit={toggleEdit}
                    />
                )}

                <div
                    ref={collectionRef}
                    style={{ maxHeight: "var(--max-height)" }}
                    className="mt-4 h-full flex gap-2 rounded-lg overflow-hidden justify-center flex-wrap"
                >
                    {data.activities?.length > 0 && (
                        <Activities
                            account={account}
                            activities={data.activities}
                        />
                    )}
                    {data.rooms?.length > 0 && (
                        <TopicAndRooms
                            authUser={user}
                            account={account}
                            rooms={data.rooms}
                        />
                    )}

                    {data.mutuals?.length > 0 && (
                        <div className="flex-1 bg-gray-700 p-2 min-w-[250px] max-w-[500px]">
                            <h5 className="font-semibold tracking-wide pb-2 text-center">
                                Mutual Followers
                            </h5>
                            <div className="overflow-hidden overflow-y-auto max-h-[74vh] p-2"></div>
                        </div>
                    )}
                </div>
            </div>
            <p className="py-2"></p>
        </>
    )
}
