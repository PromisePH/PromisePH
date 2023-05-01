import React from 'react';
function SearchItem(result) {
    return (
        <div>
            <img src={result.image} alt={result.name} />
            <h2>{result.name}</h2>
            <p>{result.position}</p>
            <p>{result.fulfilled} Fulfilled</p>
            <p>{result.unfulfilled} Unfulfilled</p>
        </div>
    );
}

export default SearchItem;