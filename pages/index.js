export default function Home() {
    return <></>
}

export const getServerSideProps = (context) => {
    context.res.writeHead(302, { Location: "/feed" })
    context.res.end()
    return { props: {} }
}

