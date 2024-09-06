import './Paginator.css';


const Paginator = ({children, currentPage, onPrevious, onNext, lastPage}) => {
    return (
        <div className="paginator">
            {children}
            <div className="paginator__controls">
                {currentPage > 1 && (
                    <button className="paginator__control" onClick={onPrevious}>
                        Previous
                    </button>
                )}
                {currentPage < lastPage && (
                    <button className="paginator__control" onClick={onNext}>
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}

export default Paginator;