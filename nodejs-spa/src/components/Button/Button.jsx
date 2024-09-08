import { Link } from 'react-router-dom';

import './Button.css';

const Button = ({children, onClick, link, type, mode, design, disabled, loading}) => {

        return !link ? (
            <button
                className={[
                    'button',
                    `button--${design}`,
                    `button--${mode}`
                ].join(' ')}
                onClick={onClick}
                disabled={disabled || loading}
                type={type}
            >
                {loading ? 'Loading...' : children}
            </button>
        )
            : (
                <Link
                    className={[
                        'button',
                        `button--${design}`,
                        `button--${mode}`
                    ].join(' ')}
                    to={link}
                >
                    {children}
                </Link>
            )
}

export default Button;