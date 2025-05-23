import { Box, VStack, Icon, Text, Link, Divider } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUsers, FiBox, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

const SidebarItem = ({ icon, children, to }) => (
  <Link
    as={RouterLink}
    to={to}
    w="full"
    p={3}
    borderRadius="md"
    _hover={{ bg: 'gray.100' }}
    display="flex"
    alignItems="center"
  >
    <Icon as={icon} mr={3} />
    <Text>{children}</Text>
  </Link>
);

const Sidebar = () => {
  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      // top="60px" is crucial and should align with the fixed Header's height
      top="60px" 
      h="calc(100vh - 60px)" // Height of sidebar is viewport minus header
      w="250px"
      bg="white" // Or useColorModeValue
      borderRightWidth={1}
      p={4}
      zIndex="docked" // Chakra zIndex for elements docked below sticky (1000)
                       // Ensure it's below Header's zIndex="sticky" (1100)
    >
      <VStack spacing={4} align="stretch">
        <SidebarItem icon={FiBarChart2} to="/admin/dashboard">
          Dashboard
        </SidebarItem>
        <SidebarItem icon={FiUsers} to="/admin/users">
          Users
        </SidebarItem>
        <SidebarItem icon={FiBox} to="/admin/products">
          Products
        </SidebarItem>
        <SidebarItem icon={FiShoppingCart} to="/admin/orders">
          Orders
        </SidebarItem>
        <Divider />
      </VStack>
    </Box>
  );
};

export default Sidebar;