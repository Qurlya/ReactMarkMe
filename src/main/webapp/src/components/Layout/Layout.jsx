import { Outlet } from 'react-router-dom';
import Header from './Header';
import "../../scss/Main.scss"

export default function Layout() {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}