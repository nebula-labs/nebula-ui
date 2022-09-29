import FlexRow from "../flex_box/FlexRow"

const Input = ({ label, type, onChange, name, value, placeholder, onBlur, error, style, disabled = false }) => {
    return (
        <div
            style={{
                ...style
            }}
        >
            <h4
                style={{
                    marginBottom: 0
                }}
            >
                {label || ''}
            </h4>
            <input
                onChange={onChange}
                type={type || "text"}
                name={name || "text-input"}
                value={value}
                placeholder={placeholder || ""}
                autoComplete="off"
                onBlur={onBlur}
                style={{
                    borderRadius: '10px',
                    height: '50px',
                    border: 0,
                    backgroundColor: '#D9D9D9',
                    padding: '1em',
                    width: "100%"
                }}
                disabled={disabled}
            />
            <div
                style={{
                    color: 'red',
                    fontSize: '.6rem'
                }}
            >
                {error}
            </div>
        </div>
    )
}

export default Input