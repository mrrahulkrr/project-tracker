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
import { addItem } from "../../store/slices/itemsSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

const AddItemForm = () => {
  const [name, setName] = useState("")
  const [cost, setCost] = useState("")
  const [nameError, setNameError] = useState("")
  const [costError, setCostError] = useState("")

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.items)
  const toast = useToast()

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (user) {
      dispatch(
        addItem({
          userId: user.uid,
          name: name.trim(),
          cost: Number.parseFloat(cost),
        }),
      )
        .unwrap()
        .then(() => {
          toast({
            title: "Item added",
            description: `${name} has been added to your items`,
            status: "success",
            duration: 3000,
            isClosable: true,
          })

          // Reset form
          setName("")
          setCost("")
        })
        .catch((error: any) => {
          toast({
            title: "Error adding item",
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

        <Button type="submit" colorScheme="blue" leftIcon={<AddIcon />} isLoading={isLoading} loadingText="Adding">
          Add Item
        </Button>
      </VStack>
    </form>
  )
}

export default AddItemForm
