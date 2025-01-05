import { logoutModAction } from "@/actions/logout-mod";
import { splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/db/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/actions/utils", () => ({
  splitSessionAndRole: jest.fn(),
}));

describe("logoutModAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect if no session token is found", async () => {
    (cookies as jest.Mock).mockResolvedValue({});
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    try {
      await logoutModAction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Expect redirect to be called with "/admin"
      expect(redirect).toHaveBeenCalledWith("/admin");
    }
  });

  it("should handle moderator not found without redirect", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await logoutModAction();

    expect(redirect).not.toHaveBeenCalled();
    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(result).toEqual({
      success: false,
      message: "Não foi encontrado nenhum Moderador com estas credenciais.",
      redirectTo: "/admin",
    });
  });

  it("should handle successful logout without redirect", async () => {
    const mockUser = {
      id: 1,
      email: "admin@example.com",
      password: "mockPassword",
      sessionToken: "mockSessiontToken",
      role: "ADMIN",
    };

    (cookies as jest.Mock).mockResolvedValue({ set: jest.fn() });
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.moderator.update as jest.Mock).mockResolvedValue({});

    const result = await logoutModAction();

    expect(redirect).not.toHaveBeenCalled();
    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.findUnique).toHaveBeenCalledWith({
      where: {
        sessionToken: "mockSessionToken",
      },
    });
    expect(prisma.moderator.update).toHaveBeenCalledWith({
      where: {
        sessionToken: "mockSessionToken",
      },
      data: {
        sessionToken: null,
      },
    });
    expect((await cookies()).set).toHaveBeenCalledWith({
      name: "sessionToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: -1,
      sameSite: "strict",
    });
    expect(result).toEqual({
      success: true,
      redirectTo: "/admin",
    });
  });

  it("should handle errors from prisma gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await logoutModAction();

    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado durante o logout. Por favor, tente mais tarde.",
    });
  });

  it("should handle errors when clearing cookies fails", async () => {
    const mockSetCookie = jest.fn().mockImplementation(() => {
      throw new Error("Cookie error");
    });
    (cookies as jest.Mock).mockResolvedValue({ set: mockSetCookie });
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      sessionToken: "mockSessionToken",
    });

    const result = await logoutModAction();

    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro inesperado durante o logout. Por favor, tente mais tarde.",
    });
  });

  it("should handle missing role in splitSessionAndRole gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      null,
    ]);

    const result = await logoutModAction();

    expect(result).toEqual({
      success: false,
      message: "Não foi encontrado nenhum Moderador com estas credenciais.",
      redirectTo: "/admin",
    });
  });
});
