import { getAllPostsAction } from "@/actions/get-all-posts";
import { prisma } from "@/db/db";

// Mock Prisma
jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
    },
  },
}));

describe("getAllPostsAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all posts successfully", async () => {
    const mockPosts = [
      {
        id: 1,
        content: "Post 1",
        answered: false,
        answer: "",
      },
      {
        id: 2,
        content: "Post 2",
        answered: true,
        answer: "Response",
      },
    ];

    (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

    const result = await getAllPostsAction();

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockPosts,
    });
  });

  it("should handle errors gracefully", async () => {
    (prisma.post.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getAllPostsAction();

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao tentar obter todos os Posts. Por favor, tente mais tarde.",
    });
  });
});
