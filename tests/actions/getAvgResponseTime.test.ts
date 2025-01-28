import { getAvgResponseTimeAction } from "@/actions/getAvgResponseTime";
import { prisma } from "@/lib/db";
import { convertMilliseconds } from "@/lib/utils";

jest.mock("@/db/db", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/utils", () => ({
  convertMilliseconds: jest.fn(),
}));

describe("getAvgResponseTimeAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 'N/A' if there are no posts found", async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getAvgResponseTimeAction();

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        answered: true,
        replied_at: {
          not: null,
        },
      },
      select: {
        created_at: true,
        replied_at: true,
      },
    });
    expect(result).toEqual({
      success: true,
      avgReplyTime: "N/A",
    });
  });

  it("should calculate the average response time correctly", async () => {
    const mockPosts = [
      {
        created_at: "2023-12-01T00:00:00.000Z",
        replied_at: "2023-12-01T01:00:00.000Z", // 1 hour difference
      },
      {
        created_at: "2023-12-02T00:00:00.000Z",
        replied_at: "2023-12-02T02:00:00.000Z", // 2 hours difference
      },
    ];

    (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
    (convertMilliseconds as jest.Mock).mockReturnValue("1 hour, 30 minutes");

    const result = await getAvgResponseTimeAction();

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        answered: true,
        replied_at: {
          not: null,
        },
      },
      select: {
        created_at: true,
        replied_at: true,
      },
    });

    const totalMs =
      new Date("2023-12-01T01:00:00.000Z").getTime() -
      new Date("2023-12-01T00:00:00.000Z").getTime() +
      (new Date("2023-12-02T02:00:00.000Z").getTime() -
        new Date("2023-12-02T00:00:00.000Z").getTime());
    const avgMs = totalMs / mockPosts.length;

    expect(convertMilliseconds).toHaveBeenCalledWith(avgMs);

    expect(result).toEqual({
      success: true,
      avgReplyTime: "1 hour, 30 minutes",
    });
  });

  it("should handle errors gracefully", async () => {
    (prisma.post.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getAvgResponseTimeAction();

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message:
        "Um erro inesperado ocorreu ao tentar obter o tempo médio de resposta. Por favor, tente mais tarde",
    });
  });
});
