import './MobileToggle.css';


const MobileToggle = ({onOpen}) => {
    return (
        <button className="mobile-toggle" onClick={onOpen}>
            <span className="mobile-toggle__bar"/>
            <span className="mobile-toggle__bar"/>
            <span className="mobile-toggle__bar"/>
        </button>
    )
}


export default MobileToggle;