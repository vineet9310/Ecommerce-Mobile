import { Box, Stat, StatLabel, StatNumber, StatHelpText, Icon } from '@chakra-ui/react';

const StatCard = ({ label, number, icon, helpText, color }) => {
  return (
    <Box
      p={5}
      bg="white"
      rounded="lg"
      shadow="base"
      borderWidth="1px"
      flex="1"
      minW="200px"
    >
      <Stat>
        <Box display="flex" alignItems="center" mb={2}>
          <Box flex="1">
            <StatLabel color="gray.500" fontSize="sm">
              {label}
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" color={color}>
              {number}
            </StatNumber>
          </Box>
          <Box
            p={2}
            bg={`${color}50`}
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={4} color={color} />
          </Box>
        </Box>
        {helpText && (
          <StatHelpText mb={0} color="gray.500">
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export default StatCard;