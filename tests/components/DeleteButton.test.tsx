import { fireEvent, render, screen } from "@testing-library/react";

import DeleteButton from "@/components/DeleteButton";

describe("DeleteButton component", () => {
  it("renders the delete icon correctly", () => {
    render(<DeleteButton onClick={jest.fn()} />);

    // Check if the button is rendered
    const icon = screen.getByTestId("delete-icon");
    expect(icon).toBeInTheDocument();

    // Check the svg element's color
    const svgElement = icon.querySelector("svg");
    expect(svgElement).toHaveAttribute("color", "red");
  });

  it("calls the onClick handled when clicked", () => {
    const onClickMock = jest.fn();

    render(<DeleteButton onClick={onClickMock} />);

    const icon = screen.getByTestId("delete-icon");

    // Simulate user click
    fireEvent.click(icon);

    // Assert that the onClick handler was called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
