import React from 'react';
import IconLink from '../IconLink';

import { AiFillHome } from 'react-icons/ai';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
function BottomNav() {
    return (
        <footer className='bg-bunker fixed bottom-0 w-full h-fit p-2 flex items-center justify-around md:hidden '>
            <IconLink>
                <Icon as={AiFillHome} boxSize={6} />
            </IconLink>
            <IconLink>
                <Icon as={FaCalendarAlt} boxSize={6} />
            </IconLink>
            <IconLink>
                <Icon as={MdOutlinePeopleAlt} boxSize={6} />
            </IconLink>
        </footer>
    );
}

export default BottomNav;