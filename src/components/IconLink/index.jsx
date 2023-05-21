import React from 'react';
function IconLink({ children, onClick }) {
    return (
        <button className='rounded hover:bg-orange-red p-1' onClick={onClick}>
            {children}
        </button>
    );
}

export default IconLink;