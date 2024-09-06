import './Backdrop.css';


const Backdrop = ({onClick, open}) => {

    return (
        <div
            className={['backdrop', open ? 'open' : ''].join(' ')}
            onClick={onClick}
        >

        </div>
    )
}

export default Backdrop;