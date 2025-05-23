"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { login, clearError } from "../../store/slices/authSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

interface LoginProps {
  onSwitchToRegister: () => void
}

const Login = ({ onSwitchToRegister }: LoginProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    dispatch(login({ email, password }))
  }

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Authentication Error",
      description: error,
      status: "error",
      duration: 5000,
      isClosable: true,
    })
    dispatch(clearError())
  }

  return (
    <Box maxW="md" mx="auto" p={6} borderRadius="lg" boxShadow="lg" bg="white">
      <VStack spacing={6}>
        <Heading size="lg">Log In</Heading>
        <Text color="gray.600">Sign in to your account to track your project costs</Text>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <VStack spacing={4} align="flex-start" w="full">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Signing in">
              Sign In
            </Button>
          </VStack>
        </form>

        <Text>
          Don't have an account?{" "}
          <Link color="blue.500" onClick={onSwitchToRegister}>
            Register here
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default Login
