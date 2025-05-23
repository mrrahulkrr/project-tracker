import { useSelector } from "react-redux"
import { Box, Text, VStack } from "@chakra-ui/react"
import type { RootState } from "../../store/store"
import OtherCostCard from "./OtherCostCard"
import LoadingSpinner from "../UI/LoadingSpinner"

const OtherCostList = () => {
  const { otherCosts, isLoading } = useSelector((state: RootState) => state.otherCosts)

  if (isLoading) {
    return <LoadingSpinner text="Loading other costs..." />
  }

  if (otherCosts.length === 0) {
    return (
      <Box textAlign="center" py={6} px={4} bg="gray.50" borderRadius="md">
        <Text color="gray.500">No other costs added yet. Add your first cost above.</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={3} align="stretch">
      {otherCosts.map((cost) => (
        <OtherCostCard key={cost.id} cost={cost} />
      ))}
    </VStack>
  )
}

export default OtherCostList
