import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '../shared/Sidebar'; // Ensure this path is correct

const AdminLayout = ({ children }) => {
  const sidebarWidth = "250px";
  const headerHeight = "60px"; // Assuming your fixed header height

  return (
    <Flex    >
      <Sidebar />
      <Box
        ml={{ base: 0, md: sidebarWidth }} // Sidebar is fixed, so we need to offset the main content
        w={{ base: "full", md: `calc(100% - ${sidebarWidth})` }}
        bg={useColorModeValue('gray.50', 'gray.800')}
        height={`calc(100vh - ${headerHeight})`} // Set explicit height matching the conceptual space
        overflowY="auto" // IMPORTANT: If content inside is taller, this Box will scroll
        p={6} // Moved padding here, so scrollbar is outside padding
      >
        {children} {/* This is where AdminDashboard, ProductManagementScreen, etc., render */}
      </Box>
    </Flex>
  );
};

export default AdminLayout;