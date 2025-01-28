import { createPostAction } from "@/actions/create-post";
import { prisma } from "@/lib/db";

// Mock Prisma
jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      create: jest.fn(),
    },
  },
}));

describe("CreatePost", () => {
  it("should create a post successfully", async () => {
    // Mock Prisma
    (prisma.post.create as jest.Mock).mockResolvedValue({
      id: 1,
      content: "Test content",
      answered: false,
      answer: "",
    });

    const formData = new FormData();
    formData.append("content", "Test content");

    const result = await createPostAction(formData);

    expect(prisma.post.create).toHaveBeenCalledWith({
      data: { content: "Test content", answered: false, answer: "" },
    });

    expect(result).toEqual({
      success: true,
      message: "Post submetido com sucesso!",
    });
  });

  it("should handle errors gracefully", async () => {
    // Mock prisma to throw error
    (prisma.post.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const formData = new FormData();
    formData.append("content", "Test content");

    const result = await createPostAction(formData);

    expect(result).toEqual({
      success: false,
      message:
        "Um erro inesperado ocorreu ao tentar submeter o Post. Por favor, tente novamente.",
    });
  });
});
