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
import { register, clearError } from "../../store/slices/authSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

interface RegisterProps {
  onSwitchToLogin: () => void
}

const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    dispatch(register({ email, password, displayName }))
  }

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Registration Error",
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
        <Heading size="lg">Create Account</Heading>
        <Text color="gray.600">Sign up to start tracking your project costs</Text>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <VStack spacing={4} align="flex-start" w="full">
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </FormControl>

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
                  placeholder="Create a password"
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

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Creating account">
              Register
            </Button>
          </VStack>
        </form>

        <Text>
          Already have an account?{" "}
          <Link color="blue.500" onClick={onSwitchToLogin}>
            Sign in
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default Register
