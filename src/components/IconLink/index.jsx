import React from 'react';
function IconLink({ children }) {
    return (
        <button className='rounded hover:bg-orange-red p-1'>
            {children}
        </button>
    );
}

export default IconLink;