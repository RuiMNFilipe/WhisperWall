import { updateUserRoleAction } from "@/actions/update-user-role";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/lib/db";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("updateUserRoleAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user successfully", async () => {
    const mockUser = {
      id: 1,
      email: "mock@mock.com",
      password: "mockPassword",
      role: "MODERATOR",
    };
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.moderator.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      role: "ADMIN",
    });

    const result = await updateUserRoleAction(1, "ADMIN");

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.moderator.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { role: "ADMIN" },
    });
    expect(result).toEqual({
      success: true,
      message: "Utilizador atualizado com sucesso.",
    });
  });

  it("should return an error if user is not authenticated", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await updateUserRoleAction(1, "ADMIN");

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).not.toHaveBeenCalled();
    expect(prisma.moderator.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas administradores podem executar esta ação.",
    });
  });

  it("should return an error if the authenticated user is not an admin", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);

    const result = await updateUserRoleAction(1, "ADMIN");

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).not.toHaveBeenCalled();
    expect(prisma.moderator.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas administradores podem executar esta ação.",
    });
  });

  it("should return an error if target user is not found", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await updateUserRoleAction(1, "ADMIN");

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.moderator.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Utilizador não encontrado.",
    });
  });

  it("should handle database errors gracefully", async () => {
    const mockUser = {
      id: 1,
      email: "mock@mock.com",
      password: "mockPassword",
      role: "MODERATOR",
    };

    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.moderator.update as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await updateUserRoleAction(1, "ADMIN");

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.moderator.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        role: "ADMIN",
      },
    });
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro ao atualizar o utilizador. Por favor, tente novamente.",
    });
  });
});
