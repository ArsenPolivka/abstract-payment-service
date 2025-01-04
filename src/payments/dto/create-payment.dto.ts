import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsObject()
  details: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}
