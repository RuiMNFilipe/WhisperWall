import { getPostAction } from "@/actions/get-post";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
    },
  },
}));

describe("getPostAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get post with specific id", async () => {
    const mockPost = {
      id: 1,
      content: "Test content",
      answered: true,
      answer: "Test answer",
    };

    (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

    const result = await getPostAction(1);

    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockPost,
    });
  });

  it("should give an error if there is no post with specified id", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getPostAction(1);

    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Não existe nenhum Post com ID 1.",
    });
  });

  it("should handle errors gracefully", async () => {
    (prisma.post.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getPostAction(1);

    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao tentar obter o Post com ID 1. Por favor, tente mais tarde.",
    });
  });
});
