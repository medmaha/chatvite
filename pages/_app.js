import "../styles/globals.css"
import NextJSProgressBar from "nextjs-progressbar"
import GlobalProvider from "../src/client/contexts/GlobalProvider"
import { SessionProvider } from "next-auth/react"

export default function Wechat({ Component, pageProps }) {
    return (
        <SessionProvider
            session={pageProps.session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
        >
            <NextJSProgressBar
                color="lightblue"
                startPosition={0.4}
                transformCSS={(css) => {
                    // manipulate css string here

                    return <style>{css}</style>
                }}
            />
            <GlobalProvider>
                <Component {...pageProps} />
            </GlobalProvider>
        </SessionProvider>
    )
}

