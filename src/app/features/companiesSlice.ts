import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: { str: string } = {
 str: 'Hello',
}

export const companiesSlice = createSlice({
 name: 'companies',
 initialState,

 reducers: {
  test(state, action: PayloadAction<string>) {
   state.str = action.payload
   console.log(action.payload)
  },
 },
})

export const { test } = companiesSlice.actions

export default companiesSlice.reducer
