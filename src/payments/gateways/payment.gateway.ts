import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: '/ws/payments', cors: { origin: '*' } })
export class DynamicPaymentGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const paymentId = client.handshake.query.paymentId as string;

    if (!paymentId) {
      client.emit('error', { message: 'Payment ID is required in query' });
      client.disconnect();

      return;
    }

    client.join(paymentId);
    client.emit('joined', { message: `Connected to payment updates for ID: ${paymentId}` });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected`);
  }

  notifyStatusUpdate(paymentId: string, status: string, service: string) {
    this.server.to(paymentId).emit('statusUpdate', { status, service });
  }

  @SubscribeMessage('joinPayment')
  handleJoinPayment(client: Socket, @MessageBody() payload: { paymentId: string }) {
    if (!payload || !payload.paymentId) {
      client.emit('error', { message: 'Payment ID is required' });
      return;
    }

    client.join(payload.paymentId);
    client.emit('joined', { message: `Subscribed to updates for payment ID: ${payload.paymentId}` });
  }
}
