import React, { useCallback, useEffect, useRef } from "react"
import Members from "./"

// prettier-ignore
export default function MobileMembers({ setIsMember, socket, room, setRoom, mobileScreenMembers, toggleMobileScreenMembers }) {
    const dialogRef = useRef()


    const handleOuterClick = useCallback((ev)=>{
        if (ev.target === dialogRef.current) {
            toggleMobileScreenMembers(false)
            dialogRef.current?.close()
        }
    },[toggleMobileScreenMembers])

     useEffect(() => {
         if (mobileScreenMembers)
             document.addEventListener("click", handleOuterClick)
         return () => document.removeEventListener("click", handleOuterClick)
     }, [handleOuterClick,mobileScreenMembers, toggleMobileScreenMembers])

     useEffect(() => {
        const dialog = dialogRef.current

        if (mobileScreenMembers){
            dialog?.showModal()
        }
        
        return ()=>{
            dialog?.close()
        }
     }, [mobileScreenMembers])

    return (
        <dialog
            ref={dialogRef}
            className="p-0 bg-transparent border backdrop:backdrop-blur-[1px] backdrop:bg-opacity-20 backdrop:bg-black overflow-hidden border-gray-400 rounded-lg"
        >
            <p className="text-xs p-2 text-white text-center animate-pulse">
                Click outside to close
            </p>
            {mobileScreenMembers && (
                <div className="max-w-[400px] w-full bg-gray-700 block">
                    <Members
                        socket={socket}
                        setRoom={setRoom}
                        room={room}
                        setIsMember={setIsMember}
                    />
                </div>
            )}
        </dialog>
    )
}
