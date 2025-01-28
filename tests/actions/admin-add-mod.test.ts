import { adminAddModAction } from "@/actions/admin-add-mod";
import { hashPassword, splitSessionAndRole } from "@/actions/utils";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

jest.mock("@/db/db", () => ({
  prisma: {
    moderator: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/actions/utils", () => ({
  ...jest.requireActual("@/actions/utils"),
  splitSessionAndRole: jest.fn(),
  hashPassword: jest.fn(() => Promise.resolve("mockHashedPassword")),
}));

describe("adminAddModAction", () => {
  const formData = new FormData();
  formData.append("email", "mockEmail");
  formData.append("password", "mockPassword");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should hash the password and create a new user successfully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.create as jest.Mock).mockResolvedValue({});

    const result = await adminAddModAction(formData);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(hashPassword).toHaveBeenCalledWith(formData.get("password"));
    expect(prisma.moderator.create).toHaveBeenCalledWith({
      data: {
        email: formData.get("email"),
        password: "mockHashedPassword",
        role: Role.MODERATOR,
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Utilizador criado com sucesso!",
    });
  });

  it("should give an error if an unauthorized user tries to create a user", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([null, null]);

    const result = await adminAddModAction(formData);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas utilizadores podem usar esta ação.",
    });
  });

  it("should give an error if a non-admin user tries to create a user", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "MODERATOR",
    ]);

    const result = await adminAddModAction(formData);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Apenas administradores podem criar utilizadores.",
    });
  });

  it("should give an error if any of the inputs is empty", async () => {
    const mockEmptyFormData = new FormData();

    const result = await adminAddModAction(mockEmptyFormData);

    expect(splitSessionAndRole).not.toHaveBeenCalled();
    expect(prisma.moderator.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "Os campos de texto são obrigatórios.",
    });
  });

  it("should handle database errors gracefully", async () => {
    (splitSessionAndRole as jest.Mock).mockResolvedValue([
      "mockSessionToken",
      "ADMIN",
    ]);
    (prisma.moderator.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await adminAddModAction(formData);

    expect(splitSessionAndRole).toHaveBeenCalledWith("sessionToken");
    expect(prisma.moderator.create).toHaveBeenCalledWith({
      data: {
        email: formData.get("email"),
        password: "mockHashedPassword",
        role: Role.MODERATOR,
      },
    });
    expect(result).toEqual({
      success: false,
      message:
        "Ocorreu um erro ao criar novo utilizador. Por favor, tente novamente.",
    });
  });
});
