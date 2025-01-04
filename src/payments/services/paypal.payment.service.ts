import { Injectable } from '@nestjs/common';

import { AbstractPaymentService } from './abstract.payment.service';

import { EPaymentService, EPaymentStatus } from 'src/utils/enums';
import type { TPaymentResponse } from 'src/utils/types';

@Injectable()
export class PayPalPaymentService extends AbstractPaymentService {
  async processPayment(details: any, amount: number): Promise<TPaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: EPaymentStatus.SUCCESSFUL, service: EPaymentService.PAYPAL }), 10000);
    });
  }
}
