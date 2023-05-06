import React from 'react';

import SearchItem from '../PostForm/SearchItem'
import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    Textarea
} from '@chakra-ui/react'

function Form2({ politicalEntity, setTitle, setDescription }) {

    return (
        <section className='flex flex-col gap-5'>
            <SearchItem result={politicalEntity} setSelectedEntity={() => { }} />
            <FormControl isRequired>
                <FormLabel>Promise Title</FormLabel>
                <Input type='text' name='title' onChange={(e) => { setTitle(e.target.value) }} />
                <FormHelperText>
                    Enter the Title of the Promise
                </FormHelperText>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Promise Description</FormLabel>
                <Textarea placeholder='Enter the Description of the Promise' onChange={(e) => { setDescription(e.target.value) }} />
                <FormHelperText>
                    Enter the Description of the Promise
                </FormHelperText>
            </FormControl>
        </section>
    );
}

export default Form2;