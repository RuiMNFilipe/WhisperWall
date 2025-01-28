import { prisma } from "@/lib/db";
import { splitSessionAndRole } from "@/actions/utils";
import { getRoleAction } from "@/actions/get-role";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("getRoleAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user role from sessionToken", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      sessionToken: "mockSessionToken",
    });

    const result = await getRoleAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        sessionToken: "mockSessionToken",
      },
    });
    expect(result).toEqual({
      success: true,
      role: "MODERATOR",
    });
  });

  it("should return an error if there is no sessionToken set", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await getRoleAction();

    expect(prisma.moderator.findUnique).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Utilizador tem que entrar para aceder a esta página.",
    });
  });

  it("should return an error if there is no moderator found with the matching sessionToken", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getRoleAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        sessionToken: "mockSessionToken",
      },
    });
    expect(result).toEqual({
      success: false,
      message: "Não existe nenhum registo de um utilizador com este ID.",
    });
  });

  it("should return an error if splitSessionAndRole throws", async () => {
    (splitSessionAndRole as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    const result = await getRoleAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    });
  });

  it("should return an error if there is an invalid role format", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "invalidRole",
    ]);

    const result = await getRoleAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message: "A função do utilizador é inválida.",
    });
  });

  it("should handle errors gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getRoleAction();

    expect(prisma.moderator.findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    });
  });
});
