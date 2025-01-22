import { modReplyAction } from "@/actions/mod-reply";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      update: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("modReplyAction", () => {
  const mockDate = new Date("2025-01-11T21:35:05.105Z");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should handle empty response gracefully", async () => {
    const formData = new FormData();
    formData.append("answer", "");

    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);

    const result = await modReplyAction(formData, 1);

    expect(result).toEqual({
      success: false,
      message: "A resposta não pode estar vazia.",
    });
  });

  it("should allow only authenticated users to reply", async () => {
    const formData = new FormData();
    formData.append("answer", "test answer");
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await modReplyAction(formData, 1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.post.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Utilizador tem que entrar para poder responder.",
    });
  });

  it("should reply successfully to a post", async () => {
    const formData = new FormData();
    formData.append("answer", "Test answer");

    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.post.update as jest.Mock).mockResolvedValue({});

    const result = await modReplyAction(formData, 1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        answer: "Test answer",
        answered: true,
        replied_at: mockDate,
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

    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.post.update as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await modReplyAction(formData, 1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.post.update).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao atualizar o post. Por favor, tente mais tarde.",
    });
  });
});
