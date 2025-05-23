import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../../services/firebase"
import type { OtherCost, OtherCostsState } from "../../types"

// Initial state
const initialState: OtherCostsState = {
  otherCosts: [],
  isLoading: false,
  error: null,
}

// Fetch other costs
export const fetchOtherCosts = createAsyncThunk(
  "otherCosts/fetchOtherCosts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, "users", userId, "otherCosts")
      const q = query(costsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const otherCosts: OtherCost[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        otherCosts.push({
          id: doc.id,
          description: data.description,
          amount: data.amount,
          createdAt: data.createdAt,
        })
      })

      return otherCosts
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Add other cost
export const addOtherCost = createAsyncThunk(
  "otherCosts/addOtherCost",
  async (
    {
      userId,
      description,
      amount,
    }: {
      userId: string
      description: string
      amount: number
    },
    { rejectWithValue },
  ) => {
    try {
      const costsRef = collection(db, "users", userId, "otherCosts")
      const newCost = {
        description,
        amount,
        createdAt: Date.now(),
      }

      const docRef = await addDoc(costsRef, newCost)

      return {
        id: docRef.id,
        ...newCost,
      } as OtherCost
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Update other cost
export const updateOtherCost = createAsyncThunk(
  "otherCosts/updateOtherCost",
  async (
    {
      userId,
      costId,
      description,
      amount,
    }: {
      userId: string
      costId: string
      description: string
      amount: number
    },
    { rejectWithValue },
  ) => {
    try {
      const costRef = doc(db, "users", userId, "otherCosts", costId)
      const updatedCost = {
        description,
        amount,
      }

      await updateDoc(costRef, updatedCost)

      return {
        id: costId,
        description,
        amount,
      } as Partial<OtherCost>
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Delete other cost
export const deleteOtherCost = createAsyncThunk(
  "otherCosts/deleteOtherCost",
  async ({ userId, costId }: { userId: string; costId: string }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, "users", userId, "otherCosts", costId)
      await deleteDoc(costRef)

      return costId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Other costs slice
const otherCostsSlice = createSlice({
  name: "otherCosts",
  initialState,
  reducers: {
    clearOtherCosts: (state) => {
      state.otherCosts = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch other costs
      .addCase(fetchOtherCosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.otherCosts = action.payload
        state.error = null
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add other cost
      .addCase(addOtherCost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.isLoading = false
        state.otherCosts = [action.payload, ...state.otherCosts]
        state.error = null
      })
      .addCase(addOtherCost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update other cost
      .addCase(updateOtherCost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        state.isLoading = false
        state.otherCosts = state.otherCosts.map((cost) =>
          cost.id === action.payload.id ? { ...cost, ...action.payload } : cost,
        )
        state.error = null
      })
      .addCase(updateOtherCost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete other cost
      .addCase(deleteOtherCost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.isLoading = false
        state.otherCosts = state.otherCosts.filter((cost) => cost.id !== action.payload)
        state.error = null
      })
      .addCase(deleteOtherCost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearOtherCosts } = otherCostsSlice.actions
export default otherCostsSlice.reducer
