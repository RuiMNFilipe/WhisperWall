import { modDeletePostAction } from "@/actions/mod-delete-post";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("modDeletePostAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a post successfully", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.delete as jest.Mock).mockResolvedValue({});

    const result = await modDeletePostAction(1);

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(prisma.post.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Post com ID 1 removido com sucesso!",
    });
  });

  it("should handle database errors gracefully", async () => {
    (prisma.post.delete as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await modDeletePostAction(1);

    expect(prisma.post.delete).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Um erro ocorreu a apagar o post. Por favor, tente mais tarde.",
    });
  });

  it("should handle post not found gracefully", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.post.delete as jest.Mock).mockResolvedValue({});

    const result = await modDeletePostAction(999);

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: {
        id: 999,
      },
    });
    expect(prisma.post.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Post que quer apagar não existe.",
    });
  });
});
