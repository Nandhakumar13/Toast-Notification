import "@testing-library/jest-dom/vitest";
import {it, describe,expect} from 'vitest';

describe("JS Test Basics", ()=>{
    it("Test Case", ()=>{
        let result = "Success message";

        expect(result).toBe("Success message");
    })
})