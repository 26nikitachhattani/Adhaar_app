jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn()
  }));
  
  import React from "react";
  import { screen } from "@testing-library/react";
  
  import OTPLoginTab from "./OTPLoginTab";
  import { renderWithProviders } from "../../test-utils";
  
  test("renders login form", () => {
    renderWithProviders(<OTPLoginTab />);
  
    expect(
      screen.getByText(/Aadhaar Number/i)
    ).toBeInTheDocument();
  
    expect(
      screen.getByText(/Linked Mobile Number/i)
    ).toBeInTheDocument();
  });