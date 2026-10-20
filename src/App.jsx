import { useState } from "react";
import "./App.css";
import ToastMsg from "./components/ToastMsg";

function App() {
  const[isToastShow, setToastShow] = useState(false);
  const[toastMsg, setToastMsg] = useState(null);
  const[msgType, setMsgType] = useState(null);
  const toastHandler = (status) => {
      setToastShow(true);

      if(status == "success"){
        setToastMsg("Success Message !!!");
        setMsgType("success");
      }
      else if(status == "error"){
        setToastMsg("Error Message !!!");
        setMsgType("error");
      }
      else{
        setToastMsg("Warning Message !!!");
        setMsgType("warning");
      }
  }
  return (
    <>
      <div className="container">
        <div className="btn-container">
          <button onClick={()=> toastHandler('success')} className="btn success-btn">Success</button>
          <button onClick={()=> toastHandler('error')} className="btn error-btn">Error</button>
          <button onClick={()=> toastHandler('warn')} className="btn warning-btn">Warning</button>
        </div>

        {
         isToastShow && <ToastMsg isToastShow={isToastShow} message={toastMsg} msgType={msgType}></ToastMsg>
        }
      </div>
    </>
  );
}

export default App;
