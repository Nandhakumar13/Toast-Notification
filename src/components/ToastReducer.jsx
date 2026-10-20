import React, { createContext, useReducer, useState } from 'react'


const max_visible_item = 3;
// initial state
const initialState = {
    visible:[],
    pending:[]
}


// reducer function

const toastReducer = function(state,action){
    switch(action.type){
        case 'ADD_TOAST' :
            const toast = action.payload;

            // check the toast id, whether it's already existing or not
            const isExist = [...state.visible, ...state.pending].some((item) => item.id === toast.id);

            if(isExist) return state;

            // check the visible queue has space to add the notification

            if(state.visible.length < max_visible_item){
                return {
                    ...state,
                    visible:[...state.visible, toast]
                }
            }

            // if visible list is full, add the upcoming toast to pending queue
            return{
                ...state,
                pending:[...state.pending, toast]
            }

        case 'REMOVE_TOAST':
            const {id} = action.payload;

            // check whether it's present in the visible list
           const isVisible =  state.visible.some((item) => item.id === id);
            // check whether it's present in the pending list
            const isPending = state.pending.some((item) => item.id === id);
            if(!isVisible && !isPending) return state;
            if(!isVisible) {
                return {
                    ...state,
                    pending:state.pending.filter((item) => item.id !== id)
                }
            }

            const visible = state.visible.filter((item) => item.id !== id);

            if(state.pending.length > 0){
                const[nextVisible, ...remainingPending] = state.pending;
                return{
                    visible:[...visible, nextVisible],
                    pending:remainingPending
                }
            }

            return {
                ...state, visible
            }
        default : return state
    }
}

// context
export const ToastContext = createContext();


// provider
export function ToastProvider({children}){
    const[state,dispatch] = useReducer(toastReducer,initialState)
    return(
        <ToastContext.Provider value={{state,dispatch}}>
            {children}
        </ToastContext.Provider>
    )
}


