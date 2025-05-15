import { Box, Grid, Flex, Button, Stack, Spinner, Alert, AlertIcon, useColorModeValue } from '@chakra-ui/react';
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign, FiStar } from 'react-icons/fi';
// Removed useState and useEffect as stats will come from RTK Query
import { useNavigate } from 'react-router-dom';
import StatCard from '../shared/StatCard'; // Ensure this path is correct
import { useGetAdminStatsQuery } from '../../slices/apiSlice'; // Import the hook

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Use the RTK Query hook to fetch admin statistics
  const { data: statsData, isLoading, error } = useGetAdminStatsQuery();

  // Determine colors for StatCards based on color mode
  const statCardColors = {
    users: useColorModeValue('blue.500', 'blue.300'),
    products: useColorModeValue('green.500', 'green.300'),
    orders: useColorModeValue('purple.500', 'purple.300'),
    revenue: useColorModeValue('orange.500', 'orange.300'),
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 120px)"> {/* Adjust minH as needed */}
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Could not load dashboard statistics: {error?.data?.message || error.message || 'Unknown error'}
      </Alert>
    );
  }

  // Default values if statsData is not yet available or some fields are missing
  const displayStats = {
    users: statsData?.totalUsers ?? 0,
    products: statsData?.totalProducts ?? 0,
    orders: statsData?.totalOrders ?? 0,
    revenue: statsData?.totalRevenue ?? 0,
  };

  return (
    <Box>
      <Stack direction={{ base: "column", sm: "row" }} spacing={4} mb={6}>
        <Button
          leftIcon={<FiBox />}
          colorScheme="blue"
          onClick={() => navigate('/admin/products')}
        >
          Manage Products
        </Button>
        <Button
          leftIcon={<FiUsers />}
          colorScheme="green"
          onClick={() => navigate('/admin/users')}
        >
          Manage Users
        </Button>
        <Button
          leftIcon={<FiStar />} // Assuming this links to review management
          colorScheme="purple" // Changed from 'teal' to 'purple' to match StatCard
          onClick={() => navigate('/admin/reviews')}
        >
          Manage Reviews
        </Button>
        {/* Add a button for orders if you have an order management screen */}
        {/* <Button
          leftIcon={<FiShoppingCart />}
          colorScheme="orange"
          onClick={() => navigate('/admin/orders')}
        >
          Manage Orders
        </Button> */}
      </Stack>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={6}
        mb={8}
      >
        <StatCard
          label="Total Users"
          number={displayStats.users.toLocaleString()}
          icon={FiUsers}
          color={statCardColors.users}
          helpText="Registered users"
        />
        <StatCard
          label="Total Products"
          number={displayStats.products.toLocaleString()}
          icon={FiBox}
          color={statCardColors.products}
          helpText="Products in inventory"
        />
        <StatCard
          label="Total Orders"
          number={displayStats.orders.toLocaleString()}
          icon={FiShoppingCart}
          color={statCardColors.orders}
          helpText="Orders processed"
        />
        <StatCard
          label="Total Revenue"
          // Format as currency, adjust if your locale needs different formatting
          number={`$${displayStats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={FiDollarSign}
          color={statCardColors.revenue}
          helpText="Revenue generated from paid orders"
        />
      </Grid>
      {/* You can add more sections here, like recent orders, top products, etc. */}
    </Box>
  );
};

export default AdminDashboard;