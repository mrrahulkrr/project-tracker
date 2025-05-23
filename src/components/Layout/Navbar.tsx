"use client"

import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorModeValue,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  DrawerCloseButton,
} from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import { signOut } from "../../store/slices/authSlice"
import { clearItems } from "../../store/slices/itemsSlice"
import { clearOtherCosts } from "../../store/slices/otherCostSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSignOut = () => {
    dispatch(signOut())
    dispatch(clearItems())
    dispatch(clearOtherCosts())
  }

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Box
      as="nav"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            Project Cost Tracker
          </Text>

          {/* Mobile menu button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open menu"
            size="lg"
          />

          {/* Desktop menu */}
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            {user && (
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                  <HStack>
                    <Avatar size="sm" name={user.displayName || user.email || undefined} bg="blue.500" />
                    <Text>{user.displayName || user.email}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
        </Flex>
      </Container>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {user && (
                <>
                  <Box p={2} borderRadius="md">
                    <HStack>
                      <Avatar size="sm" name={user.displayName || user.email || undefined} bg="blue.500" />
                      <Text fontWeight="medium">{user.displayName || user.email}</Text>
                    </HStack>
                  </Box>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar
