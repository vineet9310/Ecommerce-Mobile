import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '../shared/Sidebar'; // Import the Sidebar component

// This component provides a consistent layout for all admin pages
const AdminLayout = ({ children }) => {
  return (
    <Flex>
      {/* The Sidebar will always be visible on admin routes */}
      <Sidebar />

      {/* Main content area */}
      <Box
        // ml="250px" offsets the content to make space for the 250px wide sidebar
        ml={{ base: 0, md: "250px" }} // Adjust margin for smaller screens if needed
        w={{ base: "full", md: "calc(100% - 250px)" }} // Content takes full width on small screens, remaining width on larger
        p={6} // Add some padding around the content
        bg={useColorModeValue('gray.50', 'gray.800')} // Background color
        minH="calc(100vh - 60px)" // Minimum height (subtracting header height)
      >
        {/* Render the specific admin page component passed as children */}
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
