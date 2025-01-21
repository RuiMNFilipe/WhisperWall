import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useFormStatus } from "react-dom";

import Button from "@/components/Button";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn(),
}));

describe("Button Component", () => {
  it("displays 'Entrar' and is enabled when not pending", () => {
    (useFormStatus as jest.Mock).mockReturnValue({ pending: false });

    render(<Button>Entrar</Button>);

    const buttonElement = screen.getByRole("button", { name: "Entrar" });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
  });

  it("displays a spinner and is disabled when pending", () => {
    (useFormStatus as jest.Mock).mockReturnValue({ pending: true });

    render(<Button>Entrar</Button>);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();

    const spinnerElement = screen.getByRole("button", {
      name: /loading spinner/i,
    });
    expect(spinnerElement).toBeInTheDocument();
  });
});
