"use client"

import { useState } from "react"
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react"
import Login from "./Login"
import Register from "./Register"

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
          <Heading as="h1" size="2xl" mb={4} color="blue.600">
            Project Cost Tracker
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            Manage your project expenses efficiently. Track items, costs, and see your total budget in real-time.
          </Text>
          <Box bg="blue.50" p={6} borderRadius="md" borderLeft="4px solid" borderLeftColor="blue.500">
            <Text fontWeight="medium">
              Add items and other costs related to your project and view the total cost dynamically.
            </Text>
          </Box>
        </Box>

        <Box flex="1">
          {isLogin ? (
            <Login onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </Box>
      </Flex>
    </Container>
  )
}

export default AuthWrapper
