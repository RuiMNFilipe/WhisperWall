import { IconBaseProps } from "react-icons";
import { FaTrashAlt } from "react-icons/fa";

interface DeleteButtonProps extends IconBaseProps {
  onClick: () => void;
}

const DeleteButton = async ({ onClick, ...rest }: DeleteButtonProps) => {
  return <FaTrashAlt {...rest} onClick={onClick} color="red" />;
};

export default DeleteButton;
