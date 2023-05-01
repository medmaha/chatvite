import axios from "axios"
import React, { useEffect, useState } from "react"

export default function Paginator({
    Component,
    targetSelector,
    rootMargin = 200,
    data,
    componentProp,
    lastElement = true,
    threshold = 0.2,
}) {
    const [_data, updateData] = useState(data)
    const [OBSERVER, setOBSERVER] = useState(0)

    useEffect(() => {
        updateData(data)
    }, [data])

    useEffect(() => {
        const url = _data?.links?.next
        let element = document.querySelectorAll(targetSelector)
        if (lastElement) {
            element = element[element.length - 1]
        } else {
            element = element[0]
        }

        if (url && element && OBSERVER <= 1) {
            const observer = new IntersectionObserver(
                (e) => infiniteScroll(url, e, observer),
                {
                    threshold,
                    rootMargin: `${rootMargin}px`,
                },
            )
            console.log(element)
            observer.observe(element)

            return () => {
                return observer.disconnect()
            }
        }
    }, [_data, OBSERVER])

    function infiniteScroll(url, entries, observer) {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target)

                const _DATA = await fetchData(url)

                if (_DATA) {
                    updateData((prev) => ({
                        ..._DATA,
                        data: [...prev.data, ..._DATA.data],
                    }))
                } else {
                    console.log("hh")
                }
            }
        })
    }

    async function fetchData(url) {
        try {
            const { data } = await axios.get(url, { withCredentials: true })
            return data
        } catch (error) {
            console.error(error.message)
            const AlertEvent = new CustomEvent("new-alert", {
                detail: "invalid",
            })
            document.dispatchEvent(AlertEvent)
        }
    }

    return (
        <Component
            {...{
                [componentProp]: _data.data,
                onInit() {
                    setOBSERVER((prev) => prev + 1)
                },
            }}
        />
    )
}
