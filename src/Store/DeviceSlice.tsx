/*************************************************
 * RNSETUP
 * @exports
 * DeviceSlice.ts
 * Created by Subashree  on 03/10/2023
 * Copyright © 2023 RNSETUP. All rights reserved.
 *************************************************/
import { createSlice } from '@reduxjs/toolkit'

const initialState: deviceState = {
  isNetworkAvailable: true,
}
type deviceState = {
  isNetworkAvailable: boolean
}

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    updateNetworkStatus: (state, action) => {
      state.isNetworkAvailable = action.payload
    },
  },
})
export const { updateNetworkStatus } = deviceSlice.actions

export default deviceSlice.reducer
