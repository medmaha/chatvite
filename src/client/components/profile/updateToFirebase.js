import { firebaseStorage } from "../../../server/firebase"

import {
    ref,
    uploadBytes,
    deleteObject,
    getDownloadURL,
} from "firebase/storage"

export async function updateToFirebase(user) {
    if (!localStorage.getItem("avatar-edt")) return
    const imgUrl = localStorage.getItem("avatar")

    const file = createFileFromDataUrl(imgUrl)

    const storageReference = ref(
        firebaseStorage,
        `profiles/${user.username}--__${file.name}`,
    )

    if (user.avatar.match(/http/g))
        try {
            await deleteObject(ref(firebaseStorage, user.avatar))
            console.log("deleted existing files")
        } catch (error) {
            console.error(error.message)
        }

    const uploaded = await uploadBytes(storageReference, file)
    const url = await getDownloadURL(uploaded.ref)

    localStorage.removeItem("avatar-edt")
    return Promise.resolve(url)
}

export function createFileFromDataUrl(dataURL) {
    const MIME_TYPE = dataURL.split(";")[0].split(":")[1]

    const ascii_Char = atob(dataURL.split(",")[1])
    const ascii_CodeArray = new Uint8Array(ascii_Char.length)

    let i = ascii_Char.length
    while (i--) {
        ascii_CodeArray[i] = ascii_Char.charCodeAt(i)
    }

    const file = new File(
        [ascii_CodeArray],
        `photo-${ascii_CodeArray.byteLength}_eDT.${MIME_TYPE.split("/")[1]}`,
        {
            type: MIME_TYPE,
        },
    )

    return file
}
