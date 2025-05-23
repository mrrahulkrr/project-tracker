"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Grid, GridItem, Heading, Box, useToast } from "@chakra-ui/react"
import { fetchItems } from "../../store/slices/itemsSlice"
import { fetchOtherCosts } from "../../store/slices/otherCostSlice"
import type { RootState } from "../../store/store"
import type { AppDispatch } from "../../store/store"

import Navbar from "./Navbar"
import TotalCostDisplay from "./TotalCostDisplay"
import ItemList from "../Items/ItemList"
import AddItemForm from "../Items/AddItemForm"
import OtherCostList from "../OtherCosts/OtherCostList"
import AddOtherCostForm from "../OtherCosts/AddOtherCostForm"
import LoadingSpinner from "../UI/LoadingSpinner"

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading: itemsLoading, error: itemsError } = useSelector((state: RootState) => state.items)
  const { isLoading: costsLoading, error: costsError } = useSelector((state: RootState) => state.otherCosts)
  const toast = useToast()

  useEffect(() => {
    if (user) {
      dispatch(fetchItems(user.uid))
      dispatch(fetchOtherCosts(user.uid))
    }
  }, [dispatch, user])

  useEffect(() => {
    if (itemsError) {
      toast({
        title: "Error fetching items",
        description: itemsError,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }

    if (costsError) {
      toast({
        title: "Error fetching other costs",
        description: costsError,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }, [itemsError, costsError, toast])

  if (itemsLoading || costsLoading) {
    return <LoadingSpinner text="Loading your project data..." />
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="blue.700">
          Project Cost Tracker
        </Heading>

        <TotalCostDisplay />

        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={8}>
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h2" size="md" mb={4}>
                Items
              </Heading>
              <AddItemForm />
              <Box mt={6}>
                <ItemList />
              </Box>
            </Box>
          </GridItem>

          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h2" size="md" mb={4}>
                Other Costs
              </Heading>
              <AddOtherCostForm />
              <Box mt={6}>
                <OtherCostList />
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard
