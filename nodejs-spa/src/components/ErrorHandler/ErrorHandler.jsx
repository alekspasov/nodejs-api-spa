import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';

const ErrorHandler = ({error, onHandle}) => {
    return (
        <>
            {error && <Backdrop onClick={onHandle} />}
            {error && (
                <Modal
                    title="An Error Occurred"
                    onCancelModal={onHandle}
                    onAcceptModal={onHandle}
                    acceptEnabled
                >
                    <p>{error.message}</p>
                </Modal>
            )}
        </>
    )
}


export default ErrorHandler;