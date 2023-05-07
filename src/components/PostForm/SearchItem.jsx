import React from 'react';

import { Image } from '@chakra-ui/react'
import FallbackImage from '../../assets/img/default.jpg'

function SearchItem({ result, setSelectedEntity }) {
    let promisesCount = 0
    let fulfilledPromisesCount = 0
    let unfulfilledPromisesCount = 0

    if (result.promises && result.fulfilledPromises) {
        promisesCount = result.promises.length
        fulfilledPromisesCount = result.fulfilledPromises.length
    }

    unfulfilledPromisesCount = promisesCount - fulfilledPromisesCount

    return (
        <button onClick={() => { setSelectedEntity(result) }} className='w-full flex flex-col md:flex-row items-center justify-between my-2 py-2 px-5 bg-black-pearl focus:bg-midnight rounded-lg cursor-pointer'>
            <Image src={result.imageURL} alt={result.name} className='w-20 h-20 object-cover rounded-md' fallbackSrc={FallbackImage} />
            <h2 className='text-2xl font-extrabold'>{result.name}</h2>
            <p className='text-md'>{result.currentPosition}</p>
            <p className='text-md md:block hidden'>-</p>
            <p className='text-md'>{fulfilledPromisesCount} Fulfilled</p>
            <p className='text-md md:block hidden'>-</p>
            <p className='text-md'>{unfulfilledPromisesCount} Unfulfilled</p>
        </button>
    );
}

export default SearchItem;