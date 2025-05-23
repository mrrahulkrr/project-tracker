"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Flex, Text, IconButton, useDisclosure, Badge, HStack, useToast } from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { deleteItem } from "../../store/slices/itemsSlice"
import type { Item } from "../../types"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"
import ConfirmDialog from "../UI/ConfirmDialog"
import EditItemModal from "./EditItemModal"

interface ItemCardProps {
  item: Item
}

const ItemCard = ({ item }: ItemCardProps) => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const toast = useToast()

  const handleDelete = () => {
    if (user) {
      setIsDeleting(true)
      dispatch(deleteItem({ userId: user.uid, itemId: item.id }))
        .unwrap()
        .then(() => {
          toast({
            title: "Item deleted",
            description: `${item.name} has been removed`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          onDeleteClose()
        })
        .catch((error: any) => {
          toast({
            title: "Error deleting item",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
        .finally(() => {
          setIsDeleting(false)
        })
    }
  }

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        mb={3}
        bg="white"
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontWeight="medium">{item.name}</Text>
            <HStack spacing={2} mt={1}>
              <Badge colorScheme="blue" fontSize="sm">
                ${item.cost.toFixed(2)}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
          <HStack>
            <IconButton
              aria-label="Edit item"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete item"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={onDeleteOpen}
            />
          </HStack>
        </Flex>
      </Box>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <EditItemModal isOpen={isEditOpen} onClose={onEditClose} item={item} />
    </>
  )
}

export default ItemCard
