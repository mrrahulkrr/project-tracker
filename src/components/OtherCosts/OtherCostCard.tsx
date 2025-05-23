"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Flex, Text, IconButton, useDisclosure, Badge, HStack, useToast } from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { deleteOtherCost } from "../../store/slices/otherCostSlice"
import type { OtherCost } from "../../types"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"
import ConfirmDialog from "../UI/ConfirmDialog"
import EditOtherCostModal from "./EditOtherCostModal"

interface OtherCostCardProps {
  cost: OtherCost
}

const OtherCostCard = ({ cost }: OtherCostCardProps) => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const toast = useToast()

  const handleDelete = () => {
    if (user) {
      setIsDeleting(true)
      dispatch(deleteOtherCost({ userId: user.uid, costId: cost.id }))
        .unwrap()
        .then(() => {
          toast({
            title: "Cost deleted",
            description: `${cost.description} has been removed`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          onDeleteClose()
        })
        .catch((error: any) => {
          toast({
            title: "Error deleting cost",
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
            <Text fontWeight="medium">{cost.description}</Text>
            <HStack spacing={2} mt={1}>
              <Badge colorScheme="green" fontSize="sm">
                ${cost.amount.toFixed(2)}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {new Date(cost.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
          <HStack>
            <IconButton
              aria-label="Edit cost"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete cost"
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
        title="Delete Other Cost"
        message={`Are you sure you want to delete "${cost.description}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <EditOtherCostModal isOpen={isEditOpen} onClose={onEditClose} cost={cost} />
    </>
  )
}

export default OtherCostCard
