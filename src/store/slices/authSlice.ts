import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "../../services/firebase"
import type { AuthState, User } from "../../types"

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (
    { email, password, displayName }: { email: string; password: string; displayName: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        })
      }

      const user = userCredential.user
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      } as User
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      } as User
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Logout user
export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
  try {
    await firebaseSignOut(auth)
    return null
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isLoading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer
