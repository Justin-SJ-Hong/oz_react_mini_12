import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import '../styles/Layout.css'

export default function Layout() {
    return (
        <>
            <NavBar />
            <main className="main">
                <Outlet />
            </main>
        </>
    );
}