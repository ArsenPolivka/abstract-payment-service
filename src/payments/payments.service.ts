import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentFactoryService } from './payment.factory.service';
import { DynamicPaymentGateway } from './gateways/payment.gateway';
import { EPaymentStatus } from 'src/utils/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  private PAYMENT_PROCESSING_TIME = Number(process.env.PAYMENT_PROCESSING_TIME);
  private PAYMENT_PROCESSING_INTERVAL = Number(process.env.PAYMENT_PROCESSING_INTERVAL);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly factoryService: PaymentFactoryService,
    private readonly paymentGateway: DynamicPaymentGateway,
  ) {}

  async processPayment(createPaymentDto: CreatePaymentDto): Promise<{ status: EPaymentStatus; paymentId: string }> {
    const { method, details, amount } = createPaymentDto;
    const paymentService = this.factoryService.getPaymentService(method);

    const payment = await this.createAndSavePayment(amount, method, EPaymentStatus.PROCESSING);

    this.sendInitialStatusUpdate(payment.id, method);

    this.scheduleStatusUpdates(payment.id, method);

    this.finalizePayment(payment, details, amount, paymentService);

    return { status: EPaymentStatus.PROCESSING, paymentId: payment.id };
  }

  private async createAndSavePayment(amount: number, method: string, status: string): Promise<Payment> {
    const payment = this.paymentRepository.create({ amount, method, status });
    return await this.paymentRepository.save(payment);
  }

  private sendInitialStatusUpdate(paymentId: string, method: string): void {
    this.paymentGateway.notifyStatusUpdate(paymentId, EPaymentStatus.PROCESSING, method);
  }

  private scheduleStatusUpdates(paymentId: string, method: string): void {
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 3;
      this.paymentGateway.notifyStatusUpdate(paymentId, EPaymentStatus.PROCESSING, method);

      if (progress >= 10) {
        clearInterval(intervalId);
      }
    }, this.PAYMENT_PROCESSING_INTERVAL);
  }

  private finalizePayment(payment: Payment, details: any, amount: number, paymentService: any): void {
    setTimeout(async () => {
      const result = await paymentService.processPayment(details, amount);
      payment.status = result.status;
      await this.paymentRepository.save(payment);

      this.paymentGateway.notifyStatusUpdate(payment.id, result.status, result.service);
    }, this.PAYMENT_PROCESSING_TIME);
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }
}
