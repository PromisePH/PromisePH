import React, { useState, useEffect } from 'react';

import { Image } from '@chakra-ui/react'
import { time_stamp_to_string } from '../../utils/utils';
import FallbackImage from '../../assets/img/default.jpg'

function SearchItem({ result, setSelectedEntity }) {
    const [promisesCount, setPromiseCount] = useState(0)
    const [fulfilledPromisesCount, setFulfilledPromisesCount] = useState(0)
    const [unfulfilledPromisesCount, setUnfulfilledPromisesCount] = useState(0)

    useEffect(() => {
        if (result.promises) {
            setPromiseCount(result.promises.length)
        }
        if (result.fulfilledPromises) {
            setFulfilledPromisesCount(result.fulfilledPromises.length)
        }
        if (promisesCount >= fulfilledPromisesCount) {
            setUnfulfilledPromisesCount(promisesCount - fulfilledPromisesCount)
        }
    }, [result])

    return (
        <button onClick={() => { setSelectedEntity(result) }} className='w-full md:grid md:grid-cols-12 flex flex-col items-center justify-between my-2 py-2 px-5 bg-black-pearl focus:bg-midnight hover:bg-midnight rounded-lg cursor-pointer'>
            <Image src={result.imageURL} alt={result.name} className='w-20 h-20 object-cover rounded-md col-span-2' fallbackSrc={FallbackImage} />
            <h2 className='text-2xl col-span-3 font-extrabold'>{result.name}</h2>
            <div className='text-md col-span-3'>
                <div>
                    <strong>Position:</strong> <span className='opacity-80'>{result.currentPosition}</span>
                </div>
                {
                    result.dateAppointed ?
                        <div>
                            <strong>Date Appointed:</strong> <span className='opacity-80'>{time_stamp_to_string(result.dateAppointed)}</span>
                        </div>
                        : null
                }
                {
                    result.termDuration ?
                        <div>
                            <strong>Term Duration:</strong> <span className='opacity-80'>{result.termDuration}</span>
                        </div>
                        : null
                }
            </div>
            <p className='text-md col-span-2'>{fulfilledPromisesCount} Fulfilled</p>
            <p className='text-md col-span-2'>{unfulfilledPromisesCount} Unfulfilled</p>
        </button>
    );
}

export default SearchItem;