import type { TPaymentResponse } from "src/utils/types";

export abstract class AbstractPaymentService {
  abstract processPayment(details: any, amount: number): Promise<TPaymentResponse>;
}
