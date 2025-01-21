import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DropDownMenu from "@/components/DropDownMenu";
import { Role } from "@prisma/client";

describe("DropDownMenu component", () => {
  const mockOnSelect = jest.fn();

  const defaultProps = {
    triggerBtn: "Open Menu",
    label: "Select Role",
    options: ["ADMIN", "MODERATOR"],
    onSelect: mockOnSelect,
  };
  it("renders the trigger button correctly", () => {
    render(<DropDownMenu {...defaultProps} />);

    // Ensure the trigger element is rendered
    const triggerElement = screen.getByText("Open Menu");
    expect(triggerElement).toBeInTheDocument();
  });

  it("shows the label and options correctly", async () => {
    const user = userEvent.setup();
    render(<DropDownMenu {...defaultProps} />);

    // Ensure triggerBtn is rendered and opens dropdown menu
    const triggerButton = screen.getByText("Open Menu");
    await user.click(triggerButton);

    // Assert dropdown label and options are visible
    expect(screen.getByText("Select Role")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText("MODERATOR")).toBeInTheDocument();
  });

  it("calls onSelect with the correct option when an option is clicked", async () => {
    const user = userEvent.setup();

    render(<DropDownMenu {...defaultProps} />);

    // Open dropdown
    const triggerButton = screen.getByText("Open Menu");
    await user.click(triggerButton);

    // Click the "ADMIN" option
    const adminOption = screen.getByText("ADMIN");
    await user.click(adminOption);

    // Assert that onSelect was called with "ADMIN"
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(Role.ADMIN);
  });
});
