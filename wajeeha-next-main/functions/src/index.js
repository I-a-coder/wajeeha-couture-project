const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Email configuration - in production, use environment variables
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'     // Replace with app password (for Gmail)
  }
};

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmation - #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8bbd0; padding: 20px; text-align: center;">
          <h1 style="color: #880e4f; margin: 0;">Thank You for Your Order!</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <p>Dear ${order.shippingDetails.fullName},</p>
          
          <p>Your order has been received and is being processed. Here's a summary of your purchase:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.id}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${order.total}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
            <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.state} ${order.shippingDetails.zipCode}</p>
          </div>
          
          <h3 style="color: #880e4f; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Price</th>
              <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">Rs. ${
                  item.discount 
                    ? (item.unstichedPrice 
                      ? Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) 
                      : Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100))
                    : (item.unstichedPrice || item.stichedPrice)
                }</td>
                <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">Rs. ${
                  (item.discount 
                    ? (item.unstichedPrice 
                      ? Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) 
                      : Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100))
                    : (item.unstichedPrice || item.stichedPrice)) * item.quantity
                }</td>
              </tr>
            `).join('')}
            <tr style="background-color: #f9f9f9;">
              <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Total</strong></td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Rs. ${order.total}</strong></td>
            </tr>
          </table>
          
          <p style="margin-top: 20px;">If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <p>Warm Regards,<br>Wajeeha Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Wajeeha. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  orderStatusUpdate: (order, newStatus) => ({
    subject: `Order #${order.id} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8bbd0; padding: 20px; text-align: center;">
          <h1 style="color: #880e4f; margin: 0;">Order Status Update</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <p>Dear ${order.shippingDetails.fullName},</p>
          
          <p>We're writing to inform you that the status of your order #${order.id} has been updated to <strong>${newStatus}</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.id}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="text-transform: capitalize;">${newStatus}</span></p>
          </div>
          
          ${newStatus === 'shipped' ? `
            <p><strong>Tracking Information:</strong> ${order.trackingInfo || 'Not available yet. We will update you once available.'}</p>
          ` : ''}
          
          ${newStatus === 'delivered' ? `
            <p>Your order has been delivered! We hope you enjoy your purchase.</p>
            <p>If you have any feedback or concerns, please feel free to contact us.</p>
          ` : ''}
          
          <p>You can check the details of your order by logging into your account on our website.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Warm Regards,<br>Wajeeha Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Wajeeha. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Function to send emails
const sendEmail = async (to, template) => {
  const mailOptions = {
    from: '"Wajeeha" <your-email@gmail.com>', // Replace with your name and email
    to,
    subject: template.subject,
    html: template.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
};

// Cloud function to send order confirmation email
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    try {
      const order = {
        id: context.params.orderId,
        ...snap.data()
      };
      
      // Send to customer
      await sendEmail(
        order.shippingDetails.email,
        emailTemplates.orderConfirmation(order)
      );
      
      // Send to admin (optional)
      await sendEmail(
        'admin@wajeeha.com', // Replace with admin email
        emailTemplates.orderConfirmation(order)
      );
      
      // Update order with email sent status
      await admin.firestore().collection('orders').doc(context.params.orderId).update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  });

// Cloud function to send order status update email
exports.sendOrderStatusUpdate = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      
      // Check if status has changed
      if (beforeData.status === afterData.status) {
        console.log('Status unchanged, no email needed');
        return null;
      }
      
      const order = {
        id: context.params.orderId,
        ...afterData
      };
      
      // Send status update email
      await sendEmail(
        order.shippingDetails.email,
        emailTemplates.orderStatusUpdate(order, afterData.status)
      );
      
      // Update order with email sent status
      await admin.firestore().collection('orders').doc(context.params.orderId).update({
        statusEmailSent: true,
        statusEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error sending status update email:', error);
      return { success: false, error: error.message };
    }
  });

// Cloud function for admin to manually trigger email sending
exports.manualSendEmail = functions.https.onCall(async (data, context) => {
  // Check if request is made by an admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }
  
  // Admin check - replace with your admin logic
  const isAdmin = await checkIfAdmin(context.auth.uid);
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin privileges required');
  }
  
  const { orderId, emailType } = data;
  if (!orderId || !emailType) {
    throw new functions.https.HttpsError('invalid-argument', 'Order ID and email type are required');
  }
  
  try {
    // Get order data
    const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }
    
    const order = {
      id: orderId,
      ...orderDoc.data()
    };
    
    // Send email based on type
    if (emailType === 'confirmation') {
      await sendEmail(
        order.shippingDetails.email,
        emailTemplates.orderConfirmation(order)
      );
    } else if (emailType === 'status') {
      await sendEmail(
        order.shippingDetails.email,
        emailTemplates.orderStatusUpdate(order, order.status)
      );
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email type');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in manual email sending:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Helper function to check if user is admin
async function checkIfAdmin(uid) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}