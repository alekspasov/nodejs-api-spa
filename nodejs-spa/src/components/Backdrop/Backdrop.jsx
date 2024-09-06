import './Backdrop.css';


const Backdrop = ({onClick}) => {

    return (
        <div
            className={['backdrop', props.open ? 'open' : ''].join(' ')}
            onClick={onClick}
        >

        </div>
    )
}

export default Backdrop;