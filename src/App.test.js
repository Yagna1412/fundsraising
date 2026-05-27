import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./Components/Home", () => () => <div>Public home page</div>);
jest.mock("./Components/UserDashboard", () => () => <div>User dashboard page</div>);
jest.mock("./Components/Footer", () => () => null);
jest.mock("./Components/ChatBot", () => () => null);

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

test("shows the public home page before login", () => {
  render(<App />);

  expect(screen.getByText("Public home page")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
});

test("redirects logged-in users away from home and hides its navigation link", async () => {
  localStorage.setItem("token", "demo-user");
  localStorage.setItem("role", "USER");

  render(<App />);

  expect(await screen.findByText("User dashboard page")).toBeInTheDocument();
  expect(screen.queryByText("Public home page")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
});
