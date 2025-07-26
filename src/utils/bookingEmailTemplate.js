export function generateBookingEmail({
  bookingId,
  bookingDate,
  status,
  paymentStatus,
  customerName,
  customerPhone,
  customerEmail,
  fromCity,
  toCity,
  departureDate,
  returnDate,
  duration,
  packageType,
  adults,
  children,
  packageCost,
  transportation,
  serviceTax,
  discount,
  totalPaid,
  barcode = '',
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Om Banna Tours - Booking Receipt</title>
<style>
/* ... (keep your style block as in your template) ... */
</style>
</head>
<body>
<div class="receipt-container">
  <div class="receipt-header">
    <div class="company-name">OM BANNA TOURS & TRAVELS</div>
    <div class="company-tagline">Your Trusted Travel Partner</div>
  </div>
  <div class="receipt-title">BOOKING CONFIRMATION RECEIPT</div>
  <div class="receipt-body">
    <div class="booking-info">
      <div class="booking-left">
        <div class="booking-id">Booking ID: #${bookingId}</div>
        <div class="booking-date">Booked on: ${bookingDate}</div>
      </div>
      <div class="booking-right">
        <div class="booking-date">Status: <strong style="color: #22c55e;">${status}</strong></div>
        <div class="booking-date">Payment: <strong style="color: #22c55e;">${paymentStatus}</strong></div>
      </div>
    </div>
    <div class="customer-section">
      <div class="section-title">Passenger Details</div>
      <div class="customer-name">${customerName}</div>
      <div class="customer-details">
        Phone: ${customerPhone}<br>
        Email: ${customerEmail}
      </div>
    </div>
    <div class="journey-section">
      <div class="section-title">Journey Details</div>
      <div class="route">
        <div class="route-point">
          <div class="route-city">${fromCity}</div>
          <div class="route-label">FROM</div>
        </div>
        <div class="route-arrow">→</div>
        <div class="route-point">
          <div class="route-city">${toCity}</div>
          <div class="route-label">TO</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="detail-row"><span class="detail-label">Departure Date:</span><span class="detail-value">${departureDate}</span></div>
        <div class="detail-row"><span class="detail-label">Return Date:</span><span class="detail-value">${returnDate}</span></div>
        <div class="detail-row"><span class="detail-label">Duration:</span><span class="detail-value">${duration}</span></div>
        <div class="detail-row"><span class="detail-label">Package Type:</span><span class="detail-value">${packageType}</span></div>
        <div class="detail-row"><span class="detail-label">Adults:</span><span class="detail-value">${adults}</span></div>
        <div class="detail-row"><span class="detail-label">Children:</span><span class="detail-value">${children}</span></div>
      </div>
    </div>
    <div class="summary-section">
      <div class="section-title">Payment Summary</div>
      <div class="summary-row"><span class="summary-label">Package Cost (${adults} Adults):</span><span class="summary-value">₹${packageCost}</span></div>
      <div class="summary-row"><span class="summary-label">Transportation:</span><span class="summary-value">₹${transportation}</span></div>
      <div class="summary-row"><span class="summary-label">Service Tax (12%):</span><span class="summary-value">₹${serviceTax}</span></div>
      <div class="summary-row"><span class="summary-label">Discount Applied:</span><span class="summary-value" style="color: #22c55e;">-₹${discount}</span></div>
      <div class="summary-row"><span>TOTAL AMOUNT PAID:</span><span>₹${totalPaid}</span></div>
    </div>
    <div class="barcode-section">
      <div class="barcode">
        <div class="bar" style="height: 40px;"></div>
        <div class="bar" style="height: 30px;"></div>
        <div class="bar" style="height: 45px;"></div>
        <div class="bar" style="height: 25px;"></div>
        <div class="bar" style="height: 50px;"></div>
        <div class="bar" style="height: 35px;"></div>
        <div class="bar" style="height: 40px;"></div>
        <div class="bar" style="height: 20px;"></div>
        <div class="bar" style="height: 45px;"></div>
        <div class="bar" style="height: 30px;"></div>
        <div class="bar" style="height: 40px;"></div>
        <div class="bar" style="height: 35px;"></div>
        <div class="bar" style="height: 25px;"></div>
        <div class="bar" style="height: 50px;"></div>
        <div class="bar" style="height: 30px;"></div>
        <div class="bar" style="height: 45px;"></div>
        <div class="bar" style="height: 25px;"></div>
        <div class="bar" style="height: 40px;"></div>
      </div>
      <div class="barcode-text">${barcode || bookingId}</div>
    </div>
    <div class="important-info">
      <h4>Important Information:</h4>
      <ul>
        <li>Please carry a valid photo ID during your journey</li>
        <li>Reporting time: 2 hours before departure</li>
        <li>Our representative will contact you 24 hours prior to departure</li>
        <li>Cancellation charges apply as per terms & conditions</li>
        <li>Keep this receipt for your records</li>
      </ul>
    </div>
  </div>
  <div class="footer">
    <div class="footer-content">
      <div class="contact-info">
        📞 Customer Care: +91-141-2345678 | 📧 support@ombannatours.com
      </div>
      <div class="contact-info">
        🌐 www.ombannatours.com | 📍 Jaipur, Rajasthan
      </div>
    </div>
    <div class="footer-note">
      Thank you for choosing Om Banna Tours & Travels. Have a blessed journey!
    </div>
  </div>
</div>
</body>
</html>`;
}
