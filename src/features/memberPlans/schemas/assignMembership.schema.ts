import { z } from "zod";
import { MEMBER_PLAN_TYPE, type MemberPlanType } from "../types";

const memberPlanTypeEnum = z.enum(
  Object.values(MEMBER_PLAN_TYPE) as [MemberPlanType, ...MemberPlanType[]],
);

export const assignMembershipSchema = z.object({
  memberPlanType: memberPlanTypeEnum,
});

export type AssignMembershipSchema = z.infer<typeof assignMembershipSchema>;
