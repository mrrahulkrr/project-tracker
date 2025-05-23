"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  VStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { addOtherCost } from "../../store/slices/otherCostSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

const AddOtherCostForm = () => {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [amountError, setAmountError] = useState("")

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.otherCosts)
  const toast = useToast()

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (user) {
      dispatch(
        addOtherCost({
          userId: user.uid,
          description: description.trim(),
          amount: Number.parseFloat(amount),
        }),
      )
        .unwrap()
        .then(() => {
          toast({
            title: "Cost added",
            description: `${description} has been added to your other costs`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })

          // Reset form
          setDescription("")
          setAmount("")
        })
        .catch((error: any) => {
          toast({
            title: "Error adding cost",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
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

        <Button type="submit" colorScheme="blue" leftIcon={<AddIcon />} isLoading={isLoading} loadingText="Adding">
          Add Other Cost
        </Button>
      </VStack>
    </form>
  )
}

export default AddOtherCostForm
