import { getAnsweredPostsAction } from "@/actions/get-answered-posts";
import { prisma } from "@/lib/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
    },
  },
}));

describe("getAnsweredPostsAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find all answered posts", async () => {
    const mockPosts = [
      {
        id: 1,
        content: "Post 1",
        answered: true,
        answer: "Response 1",
      },
      {
        id: 4,
        content: "Post 4",
        answered: true,
        answer: "Response 4",
      },
      {
        id: 10,
        content: "Post 10",
        answered: true,
        answer: "Response 10",
      },
    ];

    (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

    const result = await getAnsweredPostsAction();

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockPosts,
    });
  });

  it("should handle errors gracefully", async () => {
    (prisma.post.findMany as jest.Mock).mockRejectedValue("Database error");

    const result = await getAnsweredPostsAction();

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao tentar obter lista de Posts respondidos. Por favor, tente mais tarde.",
    });
  });
});
