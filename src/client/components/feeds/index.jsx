import React from "react"
import styles from "./styles.module.css"

import Topics from "./topics"
import Activities from "./activities"
import Main from "./main"

export default function Feed({ feeds }) {
    return (
        <div className="flex justify-center gap-3">
            <div className="flex-1 hidden md:block min-w-[270px] lg:min-w-[250px] max-w-[320px]  basis-[100px]">
                <Topics />
            </div>
            <div className=" flex-1 min-w-[350px] lg:min-w-[400px] max-w-[500px]">
                <Main feeds={feeds} />
            </div>
            <div className="flex-1 hidden lg:block lg:max-w-[300px] xl:max-w-[330px]">
                <Activities />
            </div>
        </div>
    )
}
