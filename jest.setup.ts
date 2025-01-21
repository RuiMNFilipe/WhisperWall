import "@testing-library/jest-dom";

jest.mock("@radix-ui/react-portal", () => {
  return {
    __esModule: true,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});
