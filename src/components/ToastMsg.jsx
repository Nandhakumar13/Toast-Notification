import React, { useEffect } from 'react'

const ToastMsg = ({isToastShow, message,msgType}) => {


    useEffect(()=>{
        closeToast();
    },[isToastShow])

    const closeToast = () => {
        let timer =  setTimeout(() => {
            isToastShow = !isToastShow;
        },2000)

        return () => clearTimeout(timer);

    }
  return (
    <div className={`toast-container ${msgType}`}>
        <p className='toast-msg'>{message}</p>
    </div>
  )
}

export default ToastMsg