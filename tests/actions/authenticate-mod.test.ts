import { authenticateModAction } from "@/actions/authenticate-mod";
import { verifyPassword } from "@/actions/utils";
import { prisma } from "@/db/db";
import { cookies } from "next/headers";

// Mock dependencies
jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  verifyPassword: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("authenticateModAction", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should authenticate successfully with valid credentials", async () => {
    // Mock data
    const mockModerator = {
      id: 1,
      email: "mod@example.com",
      password: "hashedPassword",
      role: "moderator",
    };

    const mockSetCookie = jest.fn();

    // Mock implementations
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(mockModerator);
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (prisma.moderator.update as jest.Mock).mockResolvedValue(undefined);
    (cookies as jest.Mock).mockResolvedValue({
      set: mockSetCookie,
    });

    // Call server action
    const result = await authenticateModAction("mod@example.com", "password");

    // Assertions
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        email: "mod@example.com",
      },
    });
    expect(verifyPassword).toHaveBeenCalledWith("password", "hashedPassword");
    expect(prisma.moderator.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: { sessionToken: expect.any(String) },
    });
    expect(mockSetCookie).toHaveBeenCalledWith({
      name: "sessionToken",
      value: expect.stringMatching(/^.*|moderator$/),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 3600,
    });
    expect(result).toEqual({
      success: true,
      message: "Entrou com sucesso!",
      redirectTo: "/admin/dashboard/",
    });
  });

  it("should return an error if email or password is missing", async () => {
    const result = await authenticateModAction("", "");

    expect(result).toEqual({
      success: false,
      message: "Campos de email e password são obrigatórios.",
    });
  });

  it("should return an error if moderator email is not found", async () => {
    // Mock findUnique to return null
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await authenticateModAction(
      "mod@example.com",
      "hashedPassword"
    );

    expect(result).toEqual({
      success: false,
      message: "Credenciais inválidas. Por favor, tente novamente.",
    });
  });

  it("should return an error if the password is wrong", async () => {
    // Mock verifyPassword return false
    (verifyPassword as jest.Mock).mockResolvedValue(false);

    const result = await authenticateModAction(
      "mod@example.com",
      "hashedPassword"
    );

    expect(result).toEqual({
      success: false,
      message: "Credenciais inválidas. Por favor, tente novamente.",
    });
  });

  it("should handle errors gracefully", async () => {
    // Mock Prisma throwing error
    (prisma.moderator.findUnique as jest.Mock).mockRejectedValue(
      new Error("Unexpected Error")
    );

    const result = await authenticateModAction(
      "mod@example.com",
      "hashedPassword"
    );

    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado ao autenticar o utilizador. Por favor, tente mais tarde.",
    });
  });
});
