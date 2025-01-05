import { getUsersAction } from "@/actions/get-users";
import { prisma } from "@/db/db";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findMany: jest.fn(),
    },
  },
}));

describe("getUsersAction", () => {
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
    (prisma.moderator.findMany as jest.Mock).mockResolvedValue(mockUsersList);

    const result = await getUsersAction();

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

  it("should handle errors gracefully", async () => {
    (prisma.moderator.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getUsersAction();

    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao obter lista de moderadores. Por favor, tente mais tarde.",
    });
  });
});
