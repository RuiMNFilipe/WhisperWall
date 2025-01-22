import useAuthStore from "@/stores/authStore";
import { Role } from "@prisma/client";

describe("Auth Store", () => {
  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
  });

  it("should initialize with default values", () => {
    const { isAuthenticated, role } = useAuthStore.getState();

    expect(isAuthenticated).toBe(false);
    expect(role).toBe(null);
  });

  it("should update state on login", () => {
    const { login } = useAuthStore.getState();
    const testRole: Role = "ADMIN";

    login(testRole);

    const { isAuthenticated, role } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(role).toBe(testRole);
  });

  it("should clear state on logout", () => {
    const { login, logout } = useAuthStore.getState();
    const testRole: Role = "MODERATOR";

    login(testRole);
    logout();

    const { isAuthenticated, role } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(role).toBeNull();
  });
});
