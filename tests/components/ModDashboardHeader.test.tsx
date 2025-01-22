import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

import { Role } from "@prisma/client";
import ModDashboardHeader from "@/components/ModDashboardHeader";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn(),
}));

describe("ModDashboardHeader", () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormStatus as jest.Mock).mockReturnValue({ pending: false });
    (usePathname as jest.Mock).mockReturnValue("/admin/dashboard");
  });

  it("renders the logo and dashboard link", () => {
    render(<ModDashboardHeader userRole={null} onLogout={mockOnLogout} />);

    // Check if logo is rendered
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();

    // Check if dashboard link is rendered
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toBeInTheDocument();
  });

  it("shows the 'Painel Administração' link for admin users", () => {
    render(
      <ModDashboardHeader userRole={Role.ADMIN} onLogout={mockOnLogout} />
    );

    // Check if the 'Painel Administração' link is rendered
    const adminPanelLink = screen.getByText("Painel Administração");
    expect(adminPanelLink).toBeInTheDocument();
  });

  it("does not show the 'Painel Administração' link for non-admin users", () => {
    render(
      <ModDashboardHeader userRole={Role.MODERATOR} onLogout={mockOnLogout} />
    );

    // Check that the 'Painel Administração' link is not rendered
    const adminPanelLink = screen.queryByText("Painel Administração");
    expect(adminPanelLink).not.toBeInTheDocument();
  });

  it("disabled the logout button when pending is true", () => {
    (useFormStatus as jest.Mock).mockReturnValue({ pending: true });
    render(
      <ModDashboardHeader userRole={Role.ADMIN} onLogout={mockOnLogout} />
    );

    const logoutButton = screen.getByRole("button");
    expect(logoutButton).toBeDisabled();
  });

  it("calls onLogout when logout button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ModDashboardHeader userRole={Role.ADMIN} onLogout={mockOnLogout} />
    );

    const logoutButton = screen.getByRole("button");
    await user.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it("does not render links when on the admin path", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");
    render(
      <ModDashboardHeader userRole={Role.ADMIN} onLogout={mockOnLogout} />
    );

    // Ensure no links other than the logo are rendered
    expect(screen.queryByText("Painel Administração")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });
});
