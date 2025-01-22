import Card from "@/components/Card";
import { render, screen } from "@testing-library/react";

describe("Card component", () => {
  it("renders the content and answer props correctly", () => {
    const content = "What is the capital of France?";
    const answer = "Paris";

    render(<Card answer={answer} content={content} />);

    // Assert that the content is rendered
    const contentElement = screen.getByText(content);
    expect(contentElement).toBeInTheDocument();

    // Assert that the answer is rendered
    const answerElement = screen.getByText(answer);
    expect(answerElement).toBeInTheDocument();
  });

  it("has the correct styles applied", () => {
    const content = "What is the capital of France?";
    const answer = "Paris";

    render(<Card answer={answer} content={content} />);

    const cardElement = screen.getByRole("card");
    expect(cardElement).toHaveClass(
      "justify-self-center flex flex-col items-center w-72 bg-[#ebd741] p-5 gap-y-10 rounded-lg shadow-md"
    );
  });
});
