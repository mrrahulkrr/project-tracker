import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../../services/firebase"
import type { Item, ItemsState } from "../../types"

// Initial state
const initialState: ItemsState = {
  items: [],
  isLoading: false,
  error: null,
}

// Fetch items
export const fetchItems = createAsyncThunk("items/fetchItems", async (userId: string, { rejectWithValue }) => {
  try {
    const itemsRef = collection(db, "users", userId, "items")
    const q = query(itemsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const items: Item[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      items.push({
        id: doc.id,
        name: data.name,
        cost: data.cost,
        createdAt: data.createdAt,
      })
    })

    return items
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Add item
export const addItem = createAsyncThunk(
  "items/addItem",
  async ({ userId, name, cost }: { userId: string; name: string; cost: number }, { rejectWithValue }) => {
    try {
      const itemsRef = collection(db, "users", userId, "items")
      const newItem = {
        name,
        cost,
        createdAt: Date.now(),
      }

      const docRef = await addDoc(itemsRef, newItem)

      return {
        id: docRef.id,
        ...newItem,
      } as Item
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Update item
export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (
    {
      userId,
      itemId,
      name,
      cost,
    }: {
      userId: string
      itemId: string
      name: string
      cost: number
    },
    { rejectWithValue },
  ) => {
    try {
      const itemRef = doc(db, "users", userId, "items", itemId)
      const updatedItem = {
        name,
        cost,
      }

      await updateDoc(itemRef, updatedItem)

      return {
        id: itemId,
        name,
        cost,
      } as Partial<Item>
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Delete item
export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, "users", userId, "items", itemId)
      await deleteDoc(itemRef)

      return itemId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Items slice
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearItems: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = [action.payload, ...state.items]
        state.error = null
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload } : item))
        state.error = null
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearItems } = itemsSlice.actions
export default itemsSlice.reducer
