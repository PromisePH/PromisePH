import React from 'react';
import Logo from "../../assets/img/PromisePH_logo.png";

import {
    Box,
    Flex,
    HStack,
    Link,
    Icon,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    InputGroup,
    InputLeftElement,
    Input,
} from '@chakra-ui/react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase/firebase';
import { Link as RouteLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Search2Icon, BellIcon } from '@chakra-ui/icons';
import { AiFillHome } from 'react-icons/ai';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

import IconLink from '../IconLink';
import Avatar from '../Avatar';

const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'midnight'),
        }}
        href={'#'}>
        {children}
    </Link>
);

function NavBar() {
    const [user] = useAuthState(auth);
    const { isOpen } = useDisclosure();
    const handleLogout = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            const errorMessage = error.message;
            console.error(errorMessage)
        }
    };
    return (
        <div className='bg-bunker fixed w-full h-15'>
            <Box bg={useColorModeValue('white', 'bunker')} px={4}>
                <div className='h-16 flex items-center justify-between md:justify-center md:gap-x-20'>
                    <Link as={RouteLink} to='/' style={{ textDecoration: 'none' }}>
                        <div className='no-underline flex flex-row items-center min-w-fit'>
                            <img src={Logo} alt="PromisePH Logo" className="h-10 min-w-fit" />
                            <span className='text-center ml-2 text-orange-red font-extrabold text-2xl hidden md:block'>PromisePH</span>
                        </div>
                    </Link>
                    <div className='flex flex-row gap-x-1 md:gap-x-5'>
                        <HStack spacing={8} as={'nav'} alignItems={'center'}>
                            <HStack spacing={8} as={'nav'} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
                                <IconLink>
                                    <Icon as={AiFillHome} boxSize={6} />
                                </IconLink>
                                <IconLink>
                                    <Icon as={FaCalendarAlt} boxSize={6} />
                                </IconLink>
                                <IconLink>
                                    <Icon as={MdOutlinePeopleAlt} boxSize={6} />
                                </IconLink>
                            </HStack>
                            <InputGroup >
                                <InputLeftElement
                                    pointerEvents='none'
                                >
                                    <Search2Icon color='gray.300' />
                                </InputLeftElement>
                                <Input type='search' placeholder='Search' />
                            </InputGroup>
                        </HStack>

                        {
                            user ?
                                <HStack spacing={4}>
                                    <Box>
                                        <IconLink >
                                            <BellIcon boxSize={6} />
                                        </IconLink>
                                    </Box>
                                    <Flex alignItems={'center'}>
                                        <Menu>
                                            <MenuButton
                                                as={Button}
                                                rounded={'full'}
                                                variant={'link'}
                                                cursor={'pointer'}
                                                minW={0}>
                                                <div className='flex flex-row gap-2 items-center justify-center no-underline'>
                                                    <Avatar
                                                        name={user.displayName}
                                                    />
                                                    <span className='hidden md:inline-block'>
                                                        {user.displayName}
                                                    </span>
                                                </div>
                                            </MenuButton>
                                            <MenuList>
                                                <div className='block md:hidden'>
                                                    <MenuItem>{user.displayName}</MenuItem>
                                                    <MenuDivider />
                                                </div>
                                                <MenuItem>Link 1</MenuItem>
                                                <MenuItem>Link 2</MenuItem>
                                                <MenuDivider />
                                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>
                                </HStack>
                                :
                                <Link as={RouteLink} to='/login'>
                                    <button className='no-underline bg-orange-red hover:bg-burning-orange text-white font-bold rounded-lg py-2 px-3'>
                                        Login
                                    </button>
                                </Link>
                        }
                    </div>
                </div>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}

                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </div >
    );
}

export default NavBar;