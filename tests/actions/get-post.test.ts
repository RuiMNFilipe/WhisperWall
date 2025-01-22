import { getPostAction } from "@/actions/get-post";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
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

    (splitSessionAndRole as jest.Mock).mockReturnValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

    const result = await getPostAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockPost,
    });
  });

  it("should give an error if an unauthenticated user tries to access post", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, "USER"]);

    const result = await getPostAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.post.findUnique).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      message: "Apenas utilizadores autenticados podem aceder a esta página.",
    });
  });

  it("should give an error if there is no post with specified id", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getPostAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
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
