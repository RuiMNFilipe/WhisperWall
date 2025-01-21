import { render, screen } from "@testing-library/react";

import PostsList from "@/components/PostsList";
import { Post } from "@prisma/client";

jest.mock("@/components/Card", () => {
  const MockCard = ({
    content,
    answer,
  }: {
    content: string;
    answer: string;
  }) => (
    <div data-testid="card">
      <p>{content}</p>
      <p>{answer}</p>
    </div>
  );

  MockCard.displayName = "Card"; // Set the display name for the mocked component

  return MockCard;
});

describe("PostsList component", () => {
  const mockPosts: Post[] = [
    {
      id: 1,
      content: "Test post 1",
      answer: "Test answer 1",
      answered: true,
      created_at: new Date("2025-01-21T23:00:00Z"),
      replied_at: new Date("2025-01-22T09:00:00Z"),
    },
    {
      id: 2,
      content: "Test post 2",
      answer: "Test answer 2",
      answered: true,
      created_at: new Date("2025-01-23T23:00:00Z"),
      replied_at: new Date("2025-01-24T09:00:00Z"),
    },
  ];

  it("renders posts when answeredPosts array is not empty", () => {
    render(<PostsList answeredPosts={mockPosts} />);

    // Assert that Card components are rendered
    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(mockPosts.length);

    // Assert content and answer
    mockPosts.map((post, index) => {
      expect(cards[index]).toHaveTextContent(post.content);
      expect(cards[index]).toHaveTextContent(post.answer);
    });
  });

  it("renders a message if there are no posts", () => {
    render(<PostsList answeredPosts={[]} />);

    expect(screen.getByText("Não existem Posts ainda...")).toBeInTheDocument();
  });
});
