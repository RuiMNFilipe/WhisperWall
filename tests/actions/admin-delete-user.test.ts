import { adminDeleteUserAction } from "@/actions/admin-delete-user";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/lib/db";
import { Moderator } from "@prisma/client";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("adminDeleteUserAction", () => {
  const mockUserToDelete: Partial<Moderator> = {
    id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a user successfully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(
      mockUserToDelete
    );
    (prisma.moderator.delete as jest.Mock).mockResolvedValue({});

    const result = await adminDeleteUserAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(prisma.moderator.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Utilizador com ID 1 removido com sucesso!",
    });
  });

  it("should give an error if the user is not authenticated", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await adminDeleteUserAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).not.toHaveBeenCalled();
    expect(prisma.moderator.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas utilizadores podem utilizar esta ação.",
    });
  });

  it("should give an error if the user is not admin", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);

    const result = await adminDeleteUserAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).not.toHaveBeenCalled();
    expect(prisma.moderator.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas administradores podem utilizar esta ação.",
    });
  });

  it("should give an error if the user to delete does not exist", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await adminDeleteUserAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(prisma.moderator.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Utilizador que quer remover não existe.",
    });
  });

  it("should handle db errors gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const result = await adminDeleteUserAction(1);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(prisma.moderator.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
    });
  });
});
