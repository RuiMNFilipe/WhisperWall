import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

import ReplyForm from "@/components/ReplyForm";
import { modReplyAction } from "@/actions/mod-reply";
import { Post } from "@prisma/client";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/actions/mod-reply", () => ({
  modReplyAction: jest.fn(),
}));

describe("ReplyForm component", () => {
  const mockPost: Post = {
    id: 1,
    content: "This is a test post.",
    answer: "This is a test answer.",
    answered: false,
    created_at: new Date(),
    replied_at: null,
  };

  const mockAnsweredPost: Post = {
    ...mockPost,
    answered: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ReplyForm post={mockPost} />);

    const textarea = screen.getByPlaceholderText(
      "Escreve aqui a tua resposta..."
    );
    const button = screen.getByRole("button", { name: /submeter/i });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("disables the textarea and button if the post is already answered", () => {
    render(<ReplyForm post={mockAnsweredPost} />);

    const textarea = screen.getByPlaceholderText(
      "Escreve aqui a tua resposta..."
    );
    const button = screen.getByRole("button", { name: /submeter/i });

    expect(textarea).toHaveAttribute("readonly");
    expect(button).toBeDisabled();
    expect(textarea).toHaveValue(mockAnsweredPost.answer);
  });

  it("calls modReplyAction and shows success toast on form submission", async () => {
    const user = userEvent.setup();
    const mockFormData = new FormData();
    mockFormData.append("answer", "This is a reply.");
    (modReplyAction as jest.Mock).mockResolvedValue({
      success: true,
      redirectTo: "/admin/dashboard",
    });

    render(<ReplyForm post={mockPost} />);

    const textarea = screen.getByPlaceholderText(
      "Escreve aqui a tua resposta..."
    );
    const button = screen.getByRole("button", { name: /submeter/i });

    // Type in textarea
    await user.type(textarea, "This is a reply.");

    // Submit the form
    await user.click(button);

    expect(modReplyAction).toHaveBeenCalledWith(mockFormData, mockPost.id);
    expect(toast.success).toHaveBeenCalledWith("Post respondido com sucesso!");
  });

  it("shows error toast if modReplyAction fails", async () => {
    const user = userEvent.setup();
    (modReplyAction as jest.Mock).mockResolvedValue({
      success: false,
      message: "Failed to submit reply.",
    });

    render(<ReplyForm post={mockPost} />);

    const textarea = screen.getByPlaceholderText(
      "Escreve aqui a tua resposta..."
    );
    const button = screen.getByRole("button", { name: /submeter/i });

    await user.type(textarea, "This is a reply.");
    await user.click(button);

    expect(modReplyAction).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Failed to submit reply.");
  });
});
