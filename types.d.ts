import { Post, Role } from "@prisma/client";

type ReplyTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type ServerActionFeedback = {
  success: boolean;
  message?: string;
  redirectTo?: string;
  data?: Post[] | Post | number;
  avgReplyTime?: string | ReplyTime;
  role?: Role;
};
