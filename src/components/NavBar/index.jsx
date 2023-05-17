import React, { useState } from 'react';
import Logo from "../../assets/img/PromisePH_logo.png";
import {
    Box,
    Flex,
    HStack,
    VStack,
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
// import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import IconLink from '../IconLink';
import SearchList from '../Search/index';
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
    const [searchInput, searchInputUpdate] = useState('');
    const [inputIsActive, setInputStatus] = useState(false);
    const [user] = useAuthState(auth);
    const { isOpen } = useDisclosure();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            const errorMessage = error.message;
            console.error(errorMessage)
        }
    };
    function handleSearchSubmit(data) {
        navigate(`/search/${data}`);
    }
    return (
        <Box bg={useColorModeValue('white', 'bunker')} className='bg-bunker fixed w-full h-16 z-10 flex gap-2'>
            <div className='h-full w-full flex items-center justify-between md:justify-center md:gap-x-20 gap-2 px-2'>
                <Link as={RouteLink} to='/' style={{ textDecoration: 'none' }} className='min-w-fit'>
                    <div className='no-underline flex flex-row items-center min-w-fit'>
                        <img src={Logo} alt="PromisePH Logo" className="h-10 min-w-fit" />
                        <span className='text-center ml-2 text-orange-red font-extrabold text-2xl hidden md:block'>PromisePH</span>
                    </div>
                </Link>
                <div className='flex flex-row gap-1 md:gap-5'>
                    <div className='flex flex-row items-center gap-5 w-3/4'>
                        <div className='flex-row items-center gap-5 hidden md:flex'>
                            <IconLink>
                                <Icon as={AiFillHome} boxSize={6} />
                            </IconLink>
                            {/* <IconLink>
                                <Icon as={FaCalendarAlt} boxSize={6} />
                            </IconLink> */}
                            <IconLink>
                                <Icon as={MdOutlinePeopleAlt} boxSize={6} />
                            </IconLink>
                        </div>
                        <VStack align="stretch">
                            <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchInput); }}>
                                <InputGroup className='m-0'>
                                    <InputLeftElement
                                        pointerEvents='none'
                                    >
                                        <Search2Icon color='gray.300' />
                                    </InputLeftElement>
                                    <Input
                                        type='search'
                                        placeholder='Search'
                                        value={searchInput}
                                        onChange={(e) => {
                                            searchInputUpdate(e.target.value);
                                        }}
                                        onFocus={() => {
                                            setInputStatus(true);
                                        }}
                                        onBlur={() => {
                                            setInputStatus(false);
                                        }}
                                    />
                                </InputGroup>
                            </form>
                            <SearchList val={searchInput.toLowerCase()} visible={inputIsActive} />
                        </VStack>
                    </div>

                    {
                        user ?
                            <HStack spacing={4}>
                                <IconLink >
                                    <BellIcon boxSize={6} />
                                </IconLink>
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
                                                <span className='hidden lg:inline-block'>
                                                    {user.displayName}
                                                </span>
                                            </div>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>{user.displayName}</MenuItem>
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
    );
}

export default NavBar;