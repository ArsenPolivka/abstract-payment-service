import { Injectable, NotFoundException } from '@nestjs/common';

import { AbstractPaymentService } from './services/abstract.payment.service';

import { MasterCardPaymentService } from './services/mastercard.payment.service';
import { PayPalPaymentService } from './services/paypal.payment.service';
import { VisaPaymentService } from './services/visa.payment.service';

import { EPaymentMethod } from 'src/utils/enums';

@Injectable()
export class PaymentFactoryService {
  constructor(
    private readonly visaService: VisaPaymentService,
    private readonly mastercardService: MasterCardPaymentService,
    private readonly paypalService: PayPalPaymentService,
  ) {}

  getPaymentService(method: string): AbstractPaymentService {
    switch (method.toLowerCase()) {
      case EPaymentMethod.VISA:
        return this.visaService;
      case EPaymentMethod.MASTERCARD:
        return this.mastercardService;
      case EPaymentMethod.PAYPAL:
        return this.paypalService;
      default:
        throw new NotFoundException('Payment method not supported');
    }
  }
}
