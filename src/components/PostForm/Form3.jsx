import React, { useState } from 'react';
import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    InputGroup,
    InputLeftAddon,
    Button,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons'

function Form3({ sources, setSources }) {
    const [numSources, setNumSources] = useState(sources.length);

    const handleAddSource = () => {
        setNumSources(numSources + 1);
        setSources([...sources, '']);
    };

    const handleRemoveSource = (index) => {
        if (numSources === 1) {
            return;
        }
        const newSources = [...sources];
        newSources.splice(index, 1);
        setSources(newSources);
        setNumSources(numSources - 1);
    };

    const handleSourceChange = (index, value) => {
        const newSources = [...sources];
        newSources[index] = value;
        setSources(newSources);
    };

    return (
        <section className='flex flex-col gap-5'>
            {[...Array(numSources)].map((_, index) => (
                <div key={index} className="flex gap-2">
                    <FormControl isRequired>
                        <FormLabel className='flex gap-2 items-center'>
                            <Button
                                colorScheme='red'
                                variant='outline'
                                size='sm'
                                onClick={() => handleRemoveSource(index)}
                                className='rounded-full p-0'
                            >
                                <MinusIcon className='w-5 h-5' />
                            </Button>
                            Promise Source {index + 1}
                        </FormLabel>
                        <InputGroup>
                            <InputLeftAddon>https://</InputLeftAddon>
                            <Input
                                placeholder='site'
                                value={sources[index]}
                                onChange={(e) => handleSourceChange(index, e.target.value)}
                            />
                        </InputGroup>
                        <FormHelperText>Enter the Source of the Promise</FormHelperText>
                    </FormControl>
                </div>
            ))}
            <Button variant='link' onClick={handleAddSource} className='w-fit self-end'>
                Add Source
            </Button>
        </section>
    );
}

export default Form3;
