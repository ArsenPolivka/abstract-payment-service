import { EPaymentService, EPaymentStatus } from "./enums";

export type TPaymentResponse = {
  status: EPaymentStatus;
  service: EPaymentService;
}
