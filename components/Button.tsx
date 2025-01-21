import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} {...props}>
      {pending ? (
        <FaSpinner aria-label="Loading spinner" className="animate-spin" />
      ) : (
        "Entrar"
      )}
    </button>
  );
}

export default Button;
