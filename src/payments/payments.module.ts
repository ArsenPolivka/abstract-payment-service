import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentFactoryService } from './payment.factory.service';
import { VisaPaymentService } from './services/visa.payment.service';
import { MasterCardPaymentService } from './services/mastercard.payment.service';
import { PayPalPaymentService } from './services/paypal.payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DynamicPaymentGateway } from './gateways/payment.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentFactoryService,
    VisaPaymentService,
    MasterCardPaymentService,
    PayPalPaymentService,
    DynamicPaymentGateway,
  ],
  exports: [
    PaymentsService,
    DynamicPaymentGateway,
  ],
})
export class PaymentsModule {}
