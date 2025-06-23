import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config();
const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY!;

type Extras = {
  name: string;
  price: number;
};

type ProductsSold = {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  extras: Extras[];
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
      to: data.email,
      from: 'theburguerstation.dev@gmail.com',
      subject: 'The Burger Station: Confirmación de compra',
      html: `
  <div style="max-width:600px; margin:0 auto; padding:20px; font-family:sans-serif; background:#fff;">
    <h1 style="text-align:center; margin-bottom:8px;">🍔 The Burger Station 🚂</h1>
    <h2 style="text-align:center; margin-top:0; color:#222;">Factura de compra</h2>

    ${data.products
      .map(
        (product) => `
      <div style="border-bottom:1px solid #ccc; padding:16px 0;">

          <table style="width:100%; margin-bottom:8px;">
              <tr>
                <td style="font-size: 24px">${product.name}</td>
                <td style="font-size: 20px; text-align:right;">($${product.price.toFixed(2)})</td>
              </tr>
          </table>
        ${
          product.extras.length > 0
            ? `
          <p style="margin:6px 0 4px; font-weight:500;">Adiciones:</p>
          <table style="width:100%; font-size:14px; margin-bottom:8px;">
            ${product.extras
              .map(
                (extra) => `
              <tr>
                <td style="padding-left:16px;">${extra.name}</td>
                <td style="text-align:right;">($${extra.price.toFixed(2)})</td>
              </tr>
            `,
              )
              .join('')}
          </table>
        `
            : `<p style="margin:6px 0; color:#555;">Sin adiciones</p>`
        }

        <p style="margin:4px 0;">Cantidad: ${product.quantity}</p>
        <p style="font-size: 24px; margin:4px 0; text-align:right; font-weight:bold; color:#f97316;">Total: $${product.totalPrice.toFixed(2)}</p>
      </div>
    `,
      )
      .join('')}

    <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;" />

    <h2 style="text-align:right; color:#f97316; font-size:20px;">
      Total pagado: $${data.total.toFixed(2)}
    </h2>
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
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
}
