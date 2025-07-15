import { useAuth } from '../../contexts/AuthContext';
import {NavLink} from 'react-router-dom';
import "../../scss/Header.scss"
import "../../routes/Routes"
import {ROUTES} from "../../routes/Routes";
export default function Header() {
    const { currentUser, logout } = useAuth();

    return (
        <header className="app_header">
            {currentUser ? (
                <>
                    <NavLink to={ROUTES.MYMARKS} className="menu_btn">Мои галочки</NavLink>
                    {/*<NavLink to={ROUTES.ACTIVITIES} className="menu_btn">Активности</NavLink>*/}
                    <NavLink to={ROUTES.CHECKOUT} className="menu_btn">Проверка</NavLink>
                    <NavLink to={ROUTES.PROFILE} className="menu_btn">{currentUser.username}</NavLink>

                    <NavLink to={ROUTES.LOGOUT} onClick={logout} className="menu_btn">Выйти</NavLink>
                </>
            ) : (
                <>
                    <NavLink to={ROUTES.LOGIN} className="menu_btn">Войти</NavLink>
                    <NavLink to={ROUTES.REGISTER} className="menu_btn">Зарегистрироваться</NavLink>
                </>
            )}
        </header>
    );
}