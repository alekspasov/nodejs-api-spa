import { Link } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
    { id: 'feed', text: 'Feed', link: '/', auth: true },
    { id: 'login', text: 'Login', link: '/', auth: false },
    { id: 'signup', text: 'Signup', link: '/signup', auth: false }
];


const NavigationItems = ({isAuth, mobile, onLogout}) => {
    return (
        <>
        {navItems.filter(item => item.auth === isAuth).map(item => (
            <li key={item.id}  className={['navigation-item', mobile ? 'mobile' : ''].join(' ')}>
                <Link to={item.link}>
                    {item.text}
                </Link>
            </li>
        ))}
        {isAuth && (
        <li className="navigation-item" key="logout">
            <button onClick={onLogout}>Logout</button>
        </li>
        )}
        </>
    );
}


export default NavigationItems;