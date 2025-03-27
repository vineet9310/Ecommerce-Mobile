// NotFoundScreen.js
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFoundScreen = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box 
      p={8} 
      textAlign="center" 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <VStack spacing={6}>
        <Heading size="2xl">404 - Page Not Found</Heading>
        <Text fontSize="lg" color="gray.600">
          Oops! The page you are looking for doesn't seem to exist.
        </Text>
        <Box mt={4}>
          <Button colorScheme="blue" mr={4} onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            Go to Home
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default NotFoundScreen;