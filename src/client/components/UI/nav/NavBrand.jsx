import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function NavBrand() {
    return (
        <div data-nav-brand className="brand inline-flex">
            <h1 className="">
                <Link
                    href="/"
                    className="font-bold text-lg tracking-wider inline-flex gap-1 items-center"
                >
                    <Image
                        width={30}
                        height={30}
                        src="/images/logo.png"
                        alt="chatvite logo"
                    />

                    <span>Chatvite</span>
                </Link>
            </h1>
        </div>
    )
}
