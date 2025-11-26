import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "../LoginPage";
import authSlice from "../../slice/authSlice";
import * as authApi from "../../api/authApi";

jest.mock("../../api/authApi");
const mockLoginUser = authApi.loginUser as jest.Mock;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
    },
  });

const renderLogin = () =>
  render(
    <Provider store={createStore()}>
      <BrowserRouter>
        <LoginPage open={true} onClose={jest.fn()} onSwitchToSignUp={jest.fn()} />
      </BrowserRouter>
    </Provider>
  );

test("LoginPage full flow (single test)", async () => {
 
  mockLoginUser.mockResolvedValue({
    User: {
      Role: "PropertyOwner",
      email: "test@example.com",
    },
  });

  renderLogin();

  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  const passwordInput = screen.getByLabelText(/password/i);
  const toggleBtn = screen.getByTestId("toggle-password");

  expect(passwordInput).toHaveAttribute("type", "password");
  fireEvent.click(toggleBtn);
  expect(passwordInput).toHaveAttribute("type", "text");
  fireEvent.click(toggleBtn);
  expect(passwordInput).toHaveAttribute("type", "password");

  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/owner/homes");
  });
});