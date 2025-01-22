import { render, screen } from "@testing-library/react";
import { toast } from "react-toastify";

import { createPostAction } from "@/actions/create-post";
import PostForm from "@/components/PostForm";
import userEvent from "@testing-library/user-event";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/actions/create-post", () => ({
  createPostAction: jest.fn(),
}));

describe("PostForm component", () => {
  const mockCreatePostAction = createPostAction as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form with textarea and button", () => {
    render(<PostForm />);

    const textarea = screen.getByPlaceholderText("Em que estás a pensar?");
    const button = screen.getByRole("button", { name: /submeter/i });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("calls createPostAction with correct data on form submission", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      message: "Post created successfully!",
    };
    mockCreatePostAction.mockResolvedValue(mockResponse);

    render(<PostForm />);

    const textarea = screen.getByPlaceholderText("Em que estás a pensar?");
    const button = screen.getByRole("button", { name: /submeter/i });

    // Type into textarea
    await user.type(textarea, "This is a test post");

    // Submit form
    await user.click(button);

    expect(mockCreatePostAction).toHaveBeenCalledTimes(1);

    // Assert FormData
    const expectedFormData = new FormData();
    expectedFormData.append("content", "This is a test post");
    expect(mockCreatePostAction).toHaveBeenCalledWith(expectedFormData);

    // Assert toast message
    expect(toast.success).toHaveBeenCalledWith("Post created successfully!");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error toast if createPostAction fails", async () => {
    const user = userEvent.setup();
    const mockResponse = { success: false, message: "Failed to create post." };
    mockCreatePostAction.mockResolvedValue(mockResponse);

    render(<PostForm />);

    const textarea = screen.getByPlaceholderText("Em que estás a pensar?");
    const button = screen.getByRole("button");

    await user.type(textarea, "This is a test post.");

    await user.click(button);

    expect(mockCreatePostAction).toHaveBeenCalledTimes(1);

    // Assert error toast
    expect(toast.error).toHaveBeenCalledWith("Failed to create post.");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("does not call createPostAction if textarea is empty", async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const button = screen.getByRole("button");

    // Attemp to submit with an empty textarea
    await user.click(button);

    expect(mockCreatePostAction).not.toHaveBeenCalled();

    // No toast messages should be displayed
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
