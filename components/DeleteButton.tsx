import { IconBaseProps } from "react-icons";
import { FaTrashAlt } from "react-icons/fa";

interface DeleteButtonProps extends IconBaseProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick, ...rest }: DeleteButtonProps) => {
  return (
    <span onClick={onClick} data-testid="delete-icon">
      <FaTrashAlt {...rest} color="red" />
    </span>
  );
};

export default DeleteButton;
