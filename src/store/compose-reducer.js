// compose-reducer.js
import { createSlice } from '@reduxjs/toolkit';

const composeSlice = createSlice({
    name: 'compose',
    initialState: {
        sentMail: {},
        fetchMail: {}
    },
    reducers: {
        fetchSentMail(state, action) {
            state.sentMail = action.payload || {};
        },
        fetchMail(state, action) {
            state.fetchMail = action.payload || {};
        },
    },
});

export const composeActions = composeSlice.actions;

export default composeSlice.reducer;
