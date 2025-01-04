/* eslint-disable */
export default async () => {
    const t = {
        ["./payments/entities/payment.entity"]: await import("./payments/entities/payment.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./payments/dto/create-payment.dto"), { "CreatePaymentDto": { amount: { required: true, type: () => Number }, method: { required: true, type: () => String }, details: { required: true, type: () => ({ cardNumber: { required: true, type: () => String }, expiryDate: { required: true, type: () => String }, cvv: { required: true, type: () => String } }) } } }], [import("./payments/entities/payment.entity"), { "Payment": { id: { required: true, type: () => String }, amount: { required: true, type: () => Number }, method: { required: true, type: () => String }, status: { required: true, type: () => String } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./payments/payments.controller"), { "PaymentsController": { "initiatePayment": {}, "getAllPayments": { type: [t["./payments/entities/payment.entity"].Payment] } } }]] } };
};