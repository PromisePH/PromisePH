import React from 'react';
import Logo from "../../assets/img/PromisePH_logo.png";

import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
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
    Input
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, Search2Icon, BellIcon } from '@chakra-ui/icons';
import { AiFillHome } from 'react-icons/ai';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

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

const IconLink = ({ children }) => (
    <button className='rounded hover:bg-orange-red p-1'>
        {children}
    </button>
);

function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div className='bg-bunker fixed w-full h-15'>
            <Box bg={useColorModeValue('white', 'bunker')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <a href='/' className='flex flex-row items-center'>
                                <img src={Logo} alt="PromisePH Logo" className="h-10 w-10" />
                                <span className='text-center ml-2 text-orange-red font-extrabold text-2xl'>PromisePH</span>
                            </a>
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            <IconLink>
                                <Icon as={AiFillHome} boxSize={6} />
                            </IconLink>
                            <IconLink>
                                <Icon as={FaCalendarAlt} boxSize={6} />
                            </IconLink>
                            <IconLink>
                                <Icon as={MdOutlinePeopleAlt} boxSize={6} />
                            </IconLink>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<Search2Icon color='gray.300' />}
                                />
                                <Input type='search' placeholder='Search' />
                            </InputGroup>
                        </HStack>
                    </HStack>

                    <HStack >
                        <IconLink>
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
                                    <Avatar
                                        size={'sm'}
                                        src={
                                            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                        }
                                    />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>Link 1</MenuItem>
                                    <MenuItem>Link 2</MenuItem>
                                    <MenuDivider />
                                    <MenuItem>Link 3</MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>

                    </HStack>
                </Flex>

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
        </div>
    );
}

export default NavBar;