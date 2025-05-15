import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
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
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  SearchIcon,
  PhoneIcon,
} from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Define regular navigation items
const NAV_ITEMS = [
  {
    label: "Smartphones",
    href: "/category/smartphones",
  },
  {
    label: "Accessories",
    href: "/category/accessories",
  },
  {
    label: "Deals",
    href: "/deals",
  },
];

// Define Admin navigation items
const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard", // Changed from Admin Dashboard for brevity in header
    href: "/admin/dashboard",
  },
  // You could add more admin links here if needed, e.g.,
  // { label: "Products", href: "/admin/products" },
  // { label: "Users", href: "/admin/users" },
];

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use userInfo from Redux
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // ✅ Function to render navigation links based on isAdmin status
  const renderNavLinks = (items) => {
    return items.map((navItem) => (
      <Box key={navItem.label}>
        <Link
          as={RouterLink}
          p={2}
          to={navItem.href ?? "#"}
          fontSize={"sm"}
          fontWeight={500}
          color={useColorModeValue("gray.600", "gray.200")}
          _hover={{
            textDecoration: "none",
            color: useColorModeValue("blue.500", "blue.300"),
          }}
        >
          {navItem.label}
        </Link>
      </Box>
    ));
  };


  return (
     <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky" // Chakra UI's zIndex for sticky elements (1100)
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="sm" // Optional: add a shadow for better separation
    >
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom="1px"
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            as={RouterLink}
            to="/"
            _hover={{ color: "blue.500" }}
          >
            <Icon as={PhoneIcon} w={6} h={6} mr={2} />
            MobileShop
          </Text>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction={"row"} spacing={4}>
              {/* ✅ Render Admin links if user is admin */}
              {userInfo?.isAdmin && renderNavLinks(ADMIN_NAV_ITEMS)}
              {/* Render regular links */}
              {renderNavLinks(NAV_ITEMS)}
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {/* Search Input */}
          <InputGroup w={{ base: "100%", md: "300px" }}>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <InputRightElement>
              <IconButton
                icon={<SearchIcon />}
                aria-label="Search"
                size="sm"
                onClick={handleSearch}
              />
            </InputRightElement>
          </InputGroup>

          {/* ✅ Conditional UI - show Logout if logged in */}
          {!userInfo ? (
            <Button
              as={RouterLink}
              to="/login"
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
              _hover={{ color: "blue.500" }}
            >
              Sign In
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              fontSize={"sm"}
              fontWeight={400}
              variant="ghost"
              color={"red.500"}
              _hover={{ bg: "red.50" }}
            >
              Logout
            </Button>
          )}

          <Button
            as={RouterLink}
            to="/cart"
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"blue.400"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Cart
          </Button>
        </Stack>
      </Flex>

      {/* Mobile Navigation */}
      <Collapse in={isOpen} animateOpacity>
        {/* ✅ Pass userInfo to MobileNav */}
        <MobileNav userInfo={userInfo} />
      </Collapse>
    </Box>
  );
};

// Mobile Nav Component (updated to accept userInfo)
const MobileNav = ({ userInfo }) => {
  // ✅ Conditional array of items for mobile nav
  const mobileNavItems = userInfo?.isAdmin ? [...ADMIN_NAV_ITEMS, ...NAV_ITEMS] : NAV_ITEMS;

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {/* ✅ Map over the conditional array */}
      {mobileNavItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

// Mobile Nav Item Component (no changes needed here)
const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
          color: "blue.500",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                as={RouterLink}
                to={child.href}
                _hover={{ color: "blue.500" }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// Original NAV_ITEMS definition moved up


export default Header;