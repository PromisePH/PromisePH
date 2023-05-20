import React from 'react';
import IconLink from '../IconLink';

import { AiFillHome } from 'react-icons/ai';
import { RiTrophyFill } from 'react-icons/ri';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function BottomNav() {
    const navigate = useNavigate();
    return (
        <footer className='bg-bunker fixed bottom-0 w-full h-fit p-2 flex items-center justify-around md:hidden '>
            <IconLink onClick={() => { navigate('/') }}>
                <Icon as={AiFillHome} boxSize={6} />
            </IconLink>
            <IconLink>
                <Icon as={RiTrophyFill} boxSize={6} />
            </IconLink>
            <IconLink onClick={() => { navigate('/politicians') }}>
                <Icon as={MdOutlinePeopleAlt} boxSize={6} />
            </IconLink>
        </footer>
    );
}

export default BottomNav;