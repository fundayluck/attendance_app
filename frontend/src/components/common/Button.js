import React from 'react'

const Button = ({ name, className, onClick, type, disabled }) => {
    return (
        <button type={type} disabled={disabled} className={className} onClick={onClick}>
            {name}
        </button>
    )
}

export default Button