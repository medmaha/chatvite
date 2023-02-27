import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
    return (
        <Html lang="en">
            <title>ChatVite</title>
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
            </Head>
            <body className="">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

