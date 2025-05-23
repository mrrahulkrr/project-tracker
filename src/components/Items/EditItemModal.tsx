"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react"
import { updateItem } from "../../store/slices/itemsSlice"
import type { Item } from "../../types"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: Item
}

const EditItemModal = ({ isOpen, onClose, item }: EditItemModalProps) => {
  const [name, setName] = useState(item.name)
  const [cost, setCost] = useState(item.cost.toString())
  const [nameError, setNameError] = useState("")
  const [costError, setCostError] = useState("")

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.items)
  const toast = useToast()

  // Update form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name)
      setCost(item.cost.toString())
    }
  }, [item])

  const validateForm = () => {
    let isValid = true

    // Validate name
    if (!name.trim()) {
      setNameError("Item name is required")
      isValid = false
    } else {
      setNameError("")
    }

    // Validate cost
    if (!cost) {
      setCostError("Cost is required")
      isValid = false
    } else if (Number.parseFloat(cost) <= 0) {
      setCostError("Cost must be greater than 0")
      isValid = false
    } else {
      setCostError("")
    }

    return isValid
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    if (user) {
      dispatch(
        updateItem({
          userId: user.uid,
          itemId: item.id,
          name: name.trim(),
          cost: Number.parseFloat(cost),
        }),
      )
        .unwrap()
        .then(() => {
          toast({
            title: "Item updated",
            description: `${name} has been updated`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          onClose()
        })
        .catch((error: any) => {
          toast({
            title: "Error updating item",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!nameError}>
              <FormLabel>Item Name</FormLabel>
              <Input placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} />
              {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!costError}>
              <FormLabel>Cost ($)</FormLabel>
              <NumberInput min={0} precision={2} value={cost} onChange={(value) => setCost(value)}>
                <NumberInputField placeholder="Enter cost" />
              </NumberInput>
              {costError && <FormErrorMessage>{costError}</FormErrorMessage>}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading} loadingText="Updating">
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditItemModal
