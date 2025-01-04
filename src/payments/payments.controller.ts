import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';

import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
  ) {}

  @Post()
  async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.processPayment(createPaymentDto);
  }

  @Get()
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }
}
