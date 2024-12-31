import { Post } from "@prisma/client";

type ServerActionFeedback = {
  success: boolean;
  message?: string;
  redirectTo?: string;
  data?: Post[];
};
