import { useSelector } from "react-redux"
import { Box, Text, VStack } from "@chakra-ui/react"
import type { RootState } from "../../store/store"
import ItemCard from "./ItemCard"
import LoadingSpinner from "../UI/LoadingSpinner"

const ItemList = () => {
  const { items, isLoading } = useSelector((state: RootState) => state.items)

  if (isLoading) {
    return <LoadingSpinner text="Loading items..." />
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={6} px={4} bg="gray.50" borderRadius="md">
        <Text color="gray.500">No items added yet. Add your first item above.</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={3} align="stretch">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </VStack>
  )
}

export default ItemList
