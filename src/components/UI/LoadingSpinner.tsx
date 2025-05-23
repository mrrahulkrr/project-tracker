import { Flex, Spinner, Text } from "@chakra-ui/react"

interface LoadingSpinnerProps {
  text?: string
}

const LoadingSpinner = ({ text = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <Flex direction="column" align="center" justify="center" h="200px">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      <Text mt={4} color="gray.600" fontSize="lg">
        {text}
      </Text>
    </Flex>
  )
}

export default LoadingSpinner
