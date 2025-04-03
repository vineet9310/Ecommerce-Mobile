import { Box, Grid, Flex, useColorModeValue, Button, Stack } from '@chakra-ui/react';
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign, FiStar } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import StatCard from '../shared/StatCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  // Fetch dashboard stats
  useEffect(() => {
    // TODO: Implement API calls to fetch actual statistics
    setStats({
      users: 150,
      products: 75,
      orders: 324,
      revenue: 25600
    });
  }, []);

  return (
    <Flex>
      <Sidebar />
      <Box
        ml="250px"
        w="calc(100% - 250px)"
        p={6}
        bg={useColorModeValue('gray.50', 'gray.800')}
        minH="calc(100vh - 60px)"
      >
        <Stack direction="row" spacing={4} mb={6}>
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
            leftIcon={<FiStar />}
            colorScheme="purple"
            onClick={() => navigate('/admin/reviews')}
          >
            Manage Reviews
          </Button>
        </Stack>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          mb={8}
        >
          <StatCard
            label="Total Users"
            number={stats.users}
            icon={FiUsers}
            color="blue.500"
            helpText="Active users in platform"
          />
          <StatCard
            label="Total Products"
            number={stats.products}
            icon={FiBox}
            color="green.500"
            helpText="Products in inventory"
          />
          <StatCard
            label="Total Orders"
            number={stats.orders}
            icon={FiShoppingCart}
            color="purple.500"
            helpText="Orders processed"
          />
          <StatCard
            label="Total Revenue"
            number={`$${stats.revenue.toLocaleString()}`}
            icon={FiDollarSign}
            color="orange.500"
            helpText="Revenue generated"
          />
        </Grid>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;