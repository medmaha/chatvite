import Link from "next/link"
import Footer from "./components/Footer"
import Header from "./components/Header"
import NoData from "./components/NoData"

export default function PrivateChat({ rooms }) {
    return (
        <>
            <>{rooms.length < 1 && <NoData room="Private" />}</>
            {rooms?.map((room) => {
                return (
                    <div
                        key={room._id}
                        className="bg-gray-700 px-3 rounded-md mb-2 min-w-[250px]"
                    >
                        <Header room={room} />
                        <span className="divider"></span>

                        <Footer room={room} type="Private" />
                    </div>
                )
            })}
        </>
    )
}
