import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "@/pages/LandingPage";

// 1) mock react-router useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // keep any other exports untouched
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("clicking each role card navigates to /login/<role>", async () => {
  render(<LandingPage />);

  const roles = ["player", "team", "scout"];

  for (const role of roles) {
    const card = screen.getByRole("button", { name: new RegExp(role, "i") });
    await userEvent.click(card);
    expect(mockNavigate).toHaveBeenLastCalledWith(`/login/${role}`);
  }

  // final call count should equal number of roles
  expect(mockNavigate).toHaveBeenCalledTimes(roles.length);
});
