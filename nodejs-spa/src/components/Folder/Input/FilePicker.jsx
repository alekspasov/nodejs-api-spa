import './Input.css';


const FilePicker = ({id,label, valid, touched, onChange, onBlur}) => {
    return (
        <div className="input">
            <label htmlFor={id}>{label}</label>
            <input
                className={[
                    !valid ? 'invalid' : 'valid',
                    touched ? 'touched' : 'untouched'
                ].join(' ')}
                type="file"
                id={id}
                onChange={e => onChange(id, e.target.value, e.target.files)}
                onBlur={onBlur}
            />
        </div>
    )
}


export default FilePicker;