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
import { updateOtherCost } from "../../store/slices/otherCostSlice"
import type { OtherCost } from "../../types"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

interface EditOtherCostModalProps {
  isOpen: boolean
  onClose: () => void
  cost: OtherCost
}

const EditOtherCostModal = ({ isOpen, onClose, cost }: EditOtherCostModalProps) => {
  const [description, setDescription] = useState(cost.description)
  const [amount, setAmount] = useState(cost.amount.toString())
  const [descriptionError, setDescriptionError] = useState("")
  const [amountError, setAmountError] = useState("")

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.otherCosts)
  const toast = useToast()

  // Update form when cost changes
  useEffect(() => {
    if (cost) {
      setDescription(cost.description)
      setAmount(cost.amount.toString())
    }
  }, [cost])

  const validateForm = () => {
    let isValid = true

    // Validate description
    if (!description.trim()) {
      setDescriptionError("Description is required")
      isValid = false
    } else {
      setDescriptionError("")
    }

    // Validate amount
    if (!amount) {
      setAmountError("Amount is required")
      isValid = false
    } else if (Number.parseFloat(amount) <= 0) {
      setAmountError("Amount must be greater than 0")
      isValid = false
    } else {
      setAmountError("")
    }

    return isValid
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    if (user) {
      dispatch(
        updateOtherCost({
          userId: user.uid,
          costId: cost.id,
          description: description.trim(),
          amount: Number.parseFloat(amount),
        }),
      )
        .unwrap()
        .then(() => {
          toast({
            title: "Cost updated",
            description: `${description} has been updated`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          onClose()
        })
        .catch((error: any) => {
          toast({
            title: "Error updating cost",
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
        <ModalHeader>Edit Other Cost</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!descriptionError}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter cost description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {descriptionError && <FormErrorMessage>{descriptionError}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!amountError}>
              <FormLabel>Amount ($)</FormLabel>
              <NumberInput min={0} precision={2} value={amount} onChange={(value) => setAmount(value)}>
                <NumberInputField placeholder="Enter amount" />
              </NumberInput>
              {amountError && <FormErrorMessage>{amountError}</FormErrorMessage>}
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

export default EditOtherCostModal
