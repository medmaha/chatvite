import "../styles/globals.css"
import NextJSProgressBar from "nextjs-progressbar"
import GlobalProvider from "../src/client/contexts/GlobalProvider"
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

export default function ChatVite({ Component, pageProps }) {
    return (
        <SessionProvider
            session={pageProps.session}
            refetchInterval={5 * 60}
            // refetchOnWindowFocus={true}
            refetchWhenOffline={false}
        >
            <NextJSProgressBar
                color="lightblue"
                startPosition={0.2}
                options={{
                    showSpinner: false,
                }}
                transformCSS={(css) => {
                    // manipulate css string here

                    return <style>{css}</style>
                }}
            />
            <GlobalProvider>
                <Component {...{ ...pageProps, _data: "Mahamed Toure" }} />
            </GlobalProvider>
        </SessionProvider>
    )
}
