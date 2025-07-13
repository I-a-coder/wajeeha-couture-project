import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      to, 
      subject, 
      orderData, 
      notificationType 
    } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let htmlContent = '';
    let emailSubject = '';

    switch (notificationType) {
      case 'order_confirmation':
        emailSubject = `Order Confirmation - Order #${orderData.id}`;
        htmlContent = generateOrderConfirmationEmail(orderData);
        break;
      case 'order_status_update':
        emailSubject = `Order Status Update - Order #${orderData.id}`;
        htmlContent = generateOrderStatusUpdateEmail(orderData);
        break;
      case 'order_shipped':
        emailSubject = `Your Order Has Been Shipped - Order #${orderData.id}`;
        htmlContent = generateOrderShippedEmail(orderData);
        break;
      case 'order_delivered':
        emailSubject = `Order Delivered - Order #${orderData.id}`;
        htmlContent = generateOrderDeliveredEmail(orderData);
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailSubject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

function generateOrderConfirmationEmail(orderData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ec4899; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        <div class="content">
          <h2>Order #${orderData.id}</h2>
          <p>Dear ${orderData.shippingDetails.fullName},</p>
          <p>We have received your order and are processing it. Here are your order details:</p>
          
          <div class="order-details">
            <h3>Order Items:</h3>
            ${orderData.items.map(item => `
              <div class="item">
                <strong>${item.title}</strong><br>
                Quantity: ${item.quantity}
                ${item.selectedSize ? `<br>Size: ${item.selectedSize}` : ''}
                <br>Price: Rs. ${item.discount ? 
                  (item.unstichedPrice ? 
                    Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
                    Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100)) :
                  (item.unstichedPrice || item.stichedPrice)}
              </div>
            `).join('')}
            
            <div class="total">
              Total: Rs. ${orderData.total}
            </div>
          </div>
          
          <h3>Shipping Details:</h3>
          <p>
            ${orderData.shippingDetails.fullName}<br>
            ${orderData.shippingDetails.address}<br>
            ${orderData.shippingDetails.city}, ${orderData.shippingDetails.state} ${orderData.shippingDetails.zipCode}<br>
            Phone: ${orderData.shippingDetails.phone}
          </p>
          
          <h3>Payment Method:</h3>
          <p>${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
          
          <p>We will notify you when your order ships. Thank you for choosing Wajeeha Couture!</p>
        </div>
        <div class="footer">
          <p>Wajeeha Couture<br>
          Contact: +92 302 0010434<br>
          Email: wajeehahashmi1995@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderStatusUpdateEmail(orderData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .status { background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        <div class="content">
          <h2>Order #${orderData.id}</h2>
          <p>Dear ${orderData.shippingDetails.fullName},</p>
          
          <div class="status">
            <h3>Your order status has been updated to: <strong>${orderData.status}</strong></h3>
          </div>
          
          <p>We will continue to keep you updated on your order progress.</p>
          
          <p>Thank you for your patience!</p>
        </div>
        <div class="footer">
          <p>Wajeeha Couture<br>
          Contact: +92 302 0010434<br>
          Email: wajeehahashmi1995@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderShippedEmail(orderData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Shipped</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .shipped { background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Been Shipped!</h1>
        </div>
        <div class="content">
          <h2>Order #${orderData.id}</h2>
          <p>Dear ${orderData.shippingDetails.fullName},</p>
          
          <div class="shipped">
            <h3>🎉 Great news! Your order has been shipped!</h3>
            <p>Your order is now on its way to you. You should receive it within 3-5 business days.</p>
          </div>
          
          <p>We'll notify you once your order has been delivered.</p>
          
          <p>Thank you for choosing Wajeeha Couture!</p>
        </div>
        <div class="footer">
          <p>Wajeeha Couture<br>
          Contact: +92 302 0010434<br>
          Email: wajeehahashmi1995@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderDeliveredEmail(orderData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Delivered</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .delivered { background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Been Delivered!</h1>
        </div>
        <div class="content">
          <h2>Order #${orderData.id}</h2>
          <p>Dear ${orderData.shippingDetails.fullName},</p>
          
          <div class="delivered">
            <h3>🎉 Your order has been successfully delivered!</h3>
            <p>We hope you love your new items from Wajeeha Couture!</p>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          
          <p>Thank you for shopping with us!</p>
        </div>
        <div class="footer">
          <p>Wajeeha Couture<br>
          Contact: +92 302 0010434<br>
          Email: wajeehahashmi1995@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 