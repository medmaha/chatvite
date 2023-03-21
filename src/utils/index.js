//
export function getUserAvatarUrl(imageUrl, authUser) {
    if (!authUser) return imageUrl
    if (imageUrl.match(/-ai.png/g)) return imageUrl

    const localImage = localStorage.getItem("avatar")

    const fallback = "/images/avatar.png"

    if (localImage?.match(/(data:image|https:)/g)) return localImage

    if (!!(typeof imageUrl === "string")) return imageUrl

    return fallback
}
