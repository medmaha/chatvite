import SearchBar from "./SearchBar"
import NavBrand from "./NavBrand"
import NavProfile from "./NavProfile"
import NavLinks from "./NavLinks"
import NavMenu from "./NavMenu"

export default function Navbar() {
    return (
        <nav className="bg-gray-700 fixed top-0 left-0 w-full h-[65px] z-10 shadow-lg px-2">
            <div className="container h-full mx-auto flex items-center">
                <div className="h-full w-full flex gap-2 items-center justify-between">
                    <NavBrand />

                    <SearchBar />
                    <NavLinks />
                    <NavMenu />

                    <NavProfile />
                </div>
            </div>
        </nav>
    )
}
