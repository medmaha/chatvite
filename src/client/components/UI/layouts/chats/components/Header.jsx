import Link from "next/link"
import DateFormatter from "../../DateFormatter"

export default function Header({ room }) {
    return (
        <div className="h-max flex justify-between items-center">
            <Link
                className="px-1 cursor-pointer hover:text-blue-400 transition-[color] h-max py-2 mb-1 inline-block"
                href={`/room/${room.slug}`}
            >
                <span className="text-xl font-semibold tracking-wide inline-block">
                    {room.name}
                </span>
                <p className="truncate text-gray-300 text-sm opacity-70 font-semibold tracking-wide">
                    {room.description}
                </p>
            </Link>
            <span className="text-sm">
                <DateFormatter data={room.createdAt} />
            </span>
        </div>
    )
}
