import React, { useEffect } from 'react'

const ToastMsg = ({isToastShow, message,msgType}) => {


    useEffect(()=>{
        closeToast();
    },[isToastShow])

    const closeToast = () => {
        // isToastShow = false;
        let timer =  setTimeout(() => {
            isToastShow = false;
        },2000)

        timer();

        // return () => clearTimeout(timer);

    }
  return (
    <div className={`toast-container ${msgType}`}>
        <p className='toast-msg'>{message}</p>
    </div>
  )
}

export default ToastMsg