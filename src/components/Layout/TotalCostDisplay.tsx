import { useSelector } from "react-redux"
import { Box, Stat, StatLabel, StatNumber, StatHelpText, Flex, Divider } from "@chakra-ui/react"
import type { RootState } from "../../store/store"

const TotalCostDisplay = () => {
  const { items } = useSelector((state: RootState) => state.items)
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts)

  // Calculate total item costs
  const totalItemCost = items.reduce((total, item) => total + item.cost, 0)

  // Calculate total other costs
  const totalOtherCost = otherCosts.reduce((total, cost) => total + cost.amount, 0)

  // Calculate grand total
  const grandTotal = totalItemCost + totalOtherCost

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6} borderLeft="4px solid" borderLeftColor="blue.500">
      <Flex direction={{ base: "column", md: "row" }} justify="space-between">
        <Stat>
          <StatLabel fontSize="md">Items Total</StatLabel>
          <StatNumber>${totalItemCost.toFixed(2)}</StatNumber>
          <StatHelpText>{items.length} items</StatHelpText>
        </Stat>

        <Divider orientation="vertical" mx={4} display={{ base: "none", md: "block" }} />
        <Divider my={2} display={{ base: "block", md: "none" }} />

        <Stat>
          <StatLabel fontSize="md">Other Costs Total</StatLabel>
          <StatNumber>${totalOtherCost.toFixed(2)}</StatNumber>
          <StatHelpText>{otherCosts.length} costs</StatHelpText>
        </Stat>

        <Divider orientation="vertical" mx={4} display={{ base: "none", md: "block" }} />
        <Divider my={2} display={{ base: "block", md: "none" }} />

        <Stat>
          <StatLabel fontSize="md" fontWeight="bold">
            Grand Total
          </StatLabel>
          <StatNumber color="blue.600" fontWeight="bold">
            ${grandTotal.toFixed(2)}
          </StatNumber>
          <StatHelpText>{items.length + otherCosts.length} entries</StatHelpText>
        </Stat>
      </Flex>
    </Box>
  )
}

export default TotalCostDisplay
