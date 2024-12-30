interface CardProps {
  content: string;
  answer: string;
}

const Card = ({ content, answer }: CardProps) => {
  return (
    <div className="justify-self-center flex flex-col items-center w-72 bg-[#ebd741] p-5 gap-y-10 rounded-lg shadow-md">
      <div>
        <h2>{content}</h2>
      </div>
      <div>
        <h2>{answer}</h2>
      </div>
    </div>
  );
};

export default Card;
