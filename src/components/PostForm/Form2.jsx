import React, { useState } from 'react';

import SearchItem from '../PostForm/SearchItem'
import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    Textarea,
    Tag,
    TagLabel,
    TagCloseButton,
    InputGroup,
    InputRightElement,
    IconButton
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

function Form2({ politicalEntity, title, setTitle, description, setDescription, tags, setTags, setImageFile }) {
    const [tag, setTag] = useState('')

    const handleSetTags = () => {
        if (tag === '' || tags.includes(tag.toLowerCase())) {
            return
        }
        setTags(prevTags => [...prevTags, tag.toLowerCase()])
        setTag('')
    }

    const handleRemoveTag = (index) => {
        setTags(prevTags => prevTags.filter((_, i) => i !== index))
    }

    const handleImageChange = async (event) => {
        setImageFile(event.target.files[0]);
    };

    return (
        <section className='flex flex-col gap-5'>
            <SearchItem result={politicalEntity} setSelectedEntity={() => { }} />
            <FormControl isRequired>
                <FormLabel>Promise Title</FormLabel>
                <Input type='text' name='title' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <FormHelperText>
                    Enter the Title of the Promise
                </FormHelperText>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Promise Description</FormLabel>
                <Textarea placeholder='Enter the Description of the Promise' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                <FormHelperText>
                    Enter the Description of the Promise
                </FormHelperText>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Political Promise Image</FormLabel>
                <Input className='p-1' type='file' accept="image/*" onChange={handleImageChange} />
                <FormHelperText>
                    Enter a Relevant Image for the Promise
                </FormHelperText>
            </FormControl>

            <FormControl isRequired className='flex flex-col'>
                <div className='flex gap-2 items-start'>
                    <FormLabel>
                        Promise Tags
                    </FormLabel>
                    {
                        tags.map((tag, index) => (
                            <Tag
                                size='md'
                                key={index}
                                borderRadius='full'
                                variant='solid'
                                colorScheme='green'
                            >
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => handleRemoveTag(index)} />
                            </Tag>
                        ))
                    }
                </div>
                <InputGroup>
                    <Input type='text' name='tag' value={tag} onChange={(e) => { setTag(e.target.value) }} />
                    <InputRightElement>
                        <IconButton variant='ghost' onClick={handleSetTags} aria-label='Add tag' icon={<AddIcon />} />
                    </InputRightElement>
                </InputGroup>
                <FormHelperText>
                    Enter the Tags of the Promise
                </FormHelperText>
            </FormControl>
        </section>
    );
}

export default Form2;