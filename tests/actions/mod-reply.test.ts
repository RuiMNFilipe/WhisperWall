import { modReplyAction } from "@/actions/mod-reply";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      update: jest.fn(),
    },
  },
}));

describe("modReplyAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle empty response gracefully", async () => {
    const formData = new FormData();
    formData.append("answer", "");

    const result = await modReplyAction(formData, 1);

    expect(result).toEqual({
      success: false,
      message: "A resposta não pode estar vazia.",
    });
  });

  it("should reply successfully to a post", async () => {
    const formData = new FormData();
    formData.append("answer", "Test answer");
    (prisma.post.update as jest.Mock).mockResolvedValue({});

    const result = await modReplyAction(formData, 1);

    expect(prisma.post.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        answer: "Test answer",
        answered: true,
        replied_at: new Date(),
      },
    });
    expect(result).toEqual({
      success: true,
      redirectTo: "/admin/dashboard",
    });
  });

  it("should handle database errors gracefully", async () => {
    const formData = new FormData();
    formData.append("answer", "Test answer 2");
    (prisma.post.update as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await modReplyAction(formData, 1);

    expect(prisma.post.update).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao atualizar o post. Por favor, tente mais tarde.",
    });
  });
});
