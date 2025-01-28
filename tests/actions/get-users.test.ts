import { getUsersAction } from "@/actions/get-users";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/lib/db";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("getUsersAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get list of users successfully", async () => {
    const mockUsersList = [
      {
        id: 1,
        email: "mock@example.com",
        password: "mockPassword",
        sessionToken: "mockSessionToken",
        role: "ADMIN",
      },
      {
        id: 2,
        email: "mock2@example.com",
        password: "mockPassword",
        sessionToken: "mockSessionToken3",
        role: "MODERATOR",
      },
    ];
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findMany as jest.Mock).mockResolvedValue(mockUsersList);

    const result = await getUsersAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockUsersList,
    });
  });

  it("should return an empty list if there are no users", async () => {
    (prisma.moderator.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getUsersAction();

    expect(prisma.moderator.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should return an error if the user is not authenticated", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await getUsersAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message: "Apenas utilizadores autenticados podem aceder a esta página.",
    });
  });

  it("should return an error if the user is not an admin", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "invalidRole",
    ]);

    const result = await getUsersAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message: "Apenas administradores podem aceder a esta página.",
    });
  });

  it("should handle database errors gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getUsersAction();

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao obter lista de moderadores. Por favor, tente mais tarde.",
    });
  });
});
