import { fireEvent, render, screen } from "@testing-library/react";

import DeleteDialog from "@/components/DeleteDialog";

describe("DeleteDialog component", () => {
  it("renders the trigger element correctly", () => {
    const mockOnConfirm = jest.fn();

    render(
      <DeleteDialog
        triggerElement={<button>Open Dialog</button>}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item?"
        onConfirm={mockOnConfirm}
      />
    );

    // Ensure the trigger element is rendered
    const triggerButton = screen.getByText("Open Dialog");
    expect(triggerButton).toBeInTheDocument();
  });

  it("displays the dialog and calls onConfirm when 'Apagar' is clicked", () => {
    const mockOnConfirm = jest.fn();

    render(
      <DeleteDialog
        triggerElement={<button>Open Dialog</button>}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item?"
        onConfirm={mockOnConfirm}
      />
    );

    // Open the dialog by clicking the trigger
    const triggerButton = screen.getByText("Open Dialog");
    fireEvent.click(triggerButton);

    // Check if the dialog content is displayed
    expect(screen.getByText("Delete Confirmation")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();

    // Simulate clicking the 'Apagar' button
    const confirmButton = screen.getByText("Apagar");
    fireEvent.click(confirmButton);

    // Assert that the onConfirm function was called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("closes the dialog when 'Cancelar' is clicked", () => {
    const mockOnConfirm = jest.fn();

    render(
      <DeleteDialog
        triggerElement={<button>Open Dialog</button>}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item?"
        onConfirm={mockOnConfirm}
      />
    );
    // Open the dialog
    const triggerButton = screen.getByText("Open Dialog");
    fireEvent.click(triggerButton);

    // Simulate clicking on 'Cancelar' button
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    // Ensure the dialog content is no longer visible
    expect(
      screen.queryByText("Are you sure you want to delete this item?")
    ).not.toBeInTheDocument();
  });
});
