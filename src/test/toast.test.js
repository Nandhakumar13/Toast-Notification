import{screen, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe,it,expect } from 'vitest';

import { useContext } from 'react';
import { ToastAPIContext, ToastProvider } from '../components/ToastContext';
import ToastContainer from '../components/ToastContainer';

function TestHarness(){
    const toast = useContext(ToastAPIContext);

    return(
        <button onClick={()=>{toast.success("Saved Successfully")}}>Save</button>
    )
}

describe("Toast notification system",()=>{
    it("displays a success notification when Save is clicked",async ()=>{
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <TestHarness />
                <ToastContainer />
            </ToastProvider>
        )

        await user.click(screen.getByRole("button",{name:"Save"}));
        expect(screen.getByText("Saved Successfully")).toBeInTheDocument();
    })
})