const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly low stock check...');
  try {
    const now = new Date();
    const items = await Inventory.find();
    const lowStockItems = items.filter(i => i.quantity <= i.threshold);

    // Filter out items that have been alerted within the last 24 hours
    const itemsToAlert = lowStockItems.filter(item => {
      if (!item.lastAlertSent) return true;
      const hoursSinceLastAlert = (now - new Date(item.lastAlertSent)) / (1000 * 60 * 60);
      return hoursSinceLastAlert >= 24;
    });

    if (itemsToAlert.length > 0) {
      console.log(`Found ${itemsToAlert.length} low stock items needing alerts. Sending email...`);

      let htmlContent = `
        <h2>Low Stock Alert</h2>
        <p>The following items are running low on stock:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Current Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Threshold</th>
            </tr>
          </thead>
          <tbody>
      `;

      itemsToAlert.forEach(item => {
        htmlContent += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.category}</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: red; font-weight: bold;">${item.quantity} ${item.unit}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.threshold} ${item.unit}</td>
          </tr>
        `;
      });

      htmlContent += `
          </tbody>
        </table>
        <p>Please restock these items soon.</p>
      `;

      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'admin@slicesso.com',
        subject: '⚠️ Slicesso - Low Stock Alert',
        html: htmlContent,
      });

      // Update lastAlertSent for items that were alerted
      const updatePromises = itemsToAlert.map(item => {
        item.lastAlertSent = new Date();
        return item.save();
      });

      await Promise.all(updatePromises);
      console.log('Low stock alert sent successfully.');
    } else if (lowStockItems.length > 0) {
      console.log(`Found ${lowStockItems.length} low stock items, but all were alerted within the last 24 hours.`);
    } else {
      console.log('All inventory items are sufficiently stocked.');
    }
  } catch (error) {
    console.error('Error running low stock cron job:', error);
  }
});

module.exports = cron;