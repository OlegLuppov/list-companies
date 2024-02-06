import { configureStore } from '@reduxjs/toolkit'
import companiesReduser from '../features/companiesSlice'

const store = configureStore({
 reducer: {
  companies: companiesReduser,
 },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
