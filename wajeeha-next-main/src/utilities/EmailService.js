// Email Service for sending notifications
export const sendOrderNotification = async (orderData, notificationType) => {
  try {
    const response = await fetch('/api/email/send-order-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: orderData.shippingDetails.email,
        orderData: orderData,
        notificationType: notificationType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email notification');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (orderData) => {
  return sendOrderNotification(orderData, 'order_confirmation');
};

export const sendOrderStatusUpdate = async (orderData) => {
  return sendOrderNotification(orderData, 'order_status_update');
};

export const sendOrderShipped = async (orderData) => {
  return sendOrderNotification(orderData, 'order_shipped');
};

export const sendOrderDelivered = async (orderData) => {
  return sendOrderNotification(orderData, 'order_delivered');
}; 