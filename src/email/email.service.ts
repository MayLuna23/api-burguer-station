import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config();
const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY!;

type ProductsSold = {
  name: string;
  price: number;
  quantity: number;
};

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(SENDGRID_API_KEY);
  }

  async sendEmail(data: {
    email: string;
    total: number;
    products: ProductsSold[];
  }): Promise<{ statusCode: number; message: string; data: any }> {
    if (!SENDGRID_API_KEY) {
      throw new Error('Falta la variable de entorno SENDGRID_API_KEY');
    }

    const msg = {
      to: data.email, // Correo del destinatario
      from: 'mayraluna9723@gmail.com', // Ya debe estar verificado
      subject: 'Confirmación de compra',
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
    <h3 style="color:rgb(249, 133, 0);">The Burger Station</h3>
    <h2 style="color: #4CAF50;">¡Gracias por tu compra! 🍔💖</h2>
    <p>Hola,</p>
    <p>Te confirmamos que tu pedido ha sido procesado exitosamente. Aquí están los detalles:</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="text-align: left; border-bottom: 2px solid #4CAF50; padding: 8px;">Producto</th>
          <th style="text-align: right; border-bottom: 2px solid #4CAF50; padding: 8px;">Cantidad</th>
          <th style="text-align: right; border-bottom: 2px solid #4CAF50; padding: 8px;">Precio</th>
        </tr>
      </thead>
      <tbody>
        ${data.products
          .map(
            (product) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${product.name}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eaeaea;">${product.quantity}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eaeaea;">$${product.price.toFixed(2)}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">$${data.total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <p style="margin-top: 30px;">Si tienes alguna duda, no dudes en contactarnos.</p>
    <p style="color: #888;">Este correo es una confirmación automática, por favor no respondas.</p>

    <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Burger Station © 2025</p>
  </div>
`,
    };
    try {
      const response = await sgMail.send(msg);
      console.log(response);
      console.log('Correo enviado correctamente');
      return {
        statusCode: 200,
        message: 'Correo enviado correctamente',
        data: null,
      };
    } catch (error) {
      console.error(
        'Error al enviar correo:',
        error.response?.body || error.message,
      );
      throw new Error('No se pudo enviar el correo');
    }
  }
}
