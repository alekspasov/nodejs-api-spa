import { Link } from 'react-router-dom';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import './MainNavigation.css';

const MainNavigation = ({onOpenMobileNav, isAuth, onLogout}) => {
    return (
        <nav className="main-nav">
            <MobileToggle onOpen={onOpenMobileNav}/>
            <div className="main-nav__logo">
                <Link to="/">
                    <Logo/>
                </Link>
            </div>
            <div className="spacer"/>
            <ul className="main-nav__items">
                <NavigationItems isAuth={isAuth} onLogout={onLogout}/>
            </ul>
        </nav>
    )
}

export default MainNavigation;