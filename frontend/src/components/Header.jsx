import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  PhoneIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [search, setSearch] = useState('');

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            as={RouterLink}
            to='/'
          >
            <Icon as={PhoneIcon} w={6} h={6} mr={2} />
            MobileShop
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4}>
              {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                  <Link
                    as={RouterLink}
                    p={2}
                    to={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={useColorModeValue('gray.600', 'gray.200')}
                    _hover={{
                      textDecoration: 'none',
                      color: useColorModeValue('gray.800', 'white'),
                    }}
                  >
                    {navItem.label}
                  </Link>
                </Box>
              ))}
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <InputGroup w={{ base: '100%', md: '300px' }}>
            <Input
              placeholder='Search products...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              <SearchIcon color='gray.500' />
            </InputRightElement>
          </InputGroup>
          <Button
            as={RouterLink}
            to='/login'
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
          >
            Sign In
          </Button>
          <Button
            as={RouterLink}
            to='/cart'
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'blue.400'}
            _hover={{
              bg: 'blue.300',
            }}
          >
            Cart
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                as={RouterLink}
                to={child.href}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Smartphones',
    href: '/category/smartphones',
  },
  {
    label: 'Accessories',
    href: '/category/accessories',
  },
  {
    label: 'Deals',
    href: '/deals',
  },
];

export default Header;