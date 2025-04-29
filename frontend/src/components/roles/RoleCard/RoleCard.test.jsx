import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoleCard from "@/components/ui/RoleCard";

const fakeRole = {
  id: "player",
  title: "Connect as Player",
  description: "Showcase your skills",
  colorClass: "icon--player",
  icon: () => <svg data-testid="icon" />, // simple stub
};

test("calls onSelect with the role id when clicked", async () => {
  const onSelect = jest.fn();
  render(<RoleCard role={fakeRole} onSelect={onSelect} />);

  // verify visible text
  expect(screen.getByText(/connect as player/i)).toBeInTheDocument();

  // simulate click
  await userEvent.click(screen.getByRole("button", { name: /connect as player/i }));

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith("player");
});
