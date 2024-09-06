import './Input.css';


const Input = ({label, id, control, valid, touched, type, required, placeholder, value, onChange, onBlur, rows, }) =>{
    return (
        <div className="input">
            {label && <label htmlFor={id}>{label}</label>}
            {control === 'input' && (
                <input
                    className={[
                        !valid ? 'invalid' : 'valid',
                        touched ? 'touched' : 'untouched'
                    ].join(' ')}
                    type={type}
                    id={id}
                    required={required}
                    value={value}
                    placeholder={placeholder}
                    onChange={e => onChange(id, e.target.value, e.target.files)}
                    onBlur={onBlur}
                />
            )}
            {control === 'textarea' && (
                <textarea
                    className={[
                        !valid ? 'invalid' : 'valid',
                        touched ? 'touched' : 'untouched'
                    ].join(' ')}
                    id={id}
                    rows={rows}
                    required={required}
                    value={value}
                    onChange={e => onChange(id, e.target.value)}
                    onBlur={onBlur}
                />
            )}
        </div>
    )
}

export default Input;