import React, { useState } from 'react'

const ToastReducer = () => {

    const[visible,setVisible] = useState(3);
    const[pending, isPending] =  useState(false);

        
  return (
    <div>ToastReducer</div>
  )
}

export default ToastReducer