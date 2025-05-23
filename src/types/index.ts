// User type
export interface User {
  uid: string
  email: string | null
  displayName: string | null
}

// Item type
export interface Item {
  id: string
  name: string
  cost: number
  createdAt: number
}

// Other Cost type
export interface OtherCost {
  id: string
  description: string
  amount: number
  createdAt: number
}

// Auth state
export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Items state
export interface ItemsState {
  items: Item[]
  isLoading: boolean
  error: string | null
}

// Other Costs state
export interface OtherCostsState {
  otherCosts: OtherCost[]
  isLoading: boolean
  error: string | null
}

// Root state
export interface RootState {
  auth: AuthState
  items: ItemsState
  otherCosts: OtherCostsState
}
