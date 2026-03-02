const { z } = require('zod');

const createPaymentSchema = z.object({
  bookingId: z.string().cuid(),
  qrCodeUrl: z.string().url().optional(), // QR Code ของ Payment Method
});

const uploadReceiptSchema = z.object({
  amount: z.number().positive(),
  referenceNumber: z.string().optional(),
  receiptNote: z.string().optional(),
  // receiptImage จะมาจาก multipart/form-data
});

const verifyPaymentSchema = z.object({
  verificationStatus: z.enum(['approved', 'rejected']),
  verificationNote: z.string().optional(),
});

const listPaymentsQuerySchema = z.object({
  status: z.enum(['pending', 'completed', 'verified', 'rejected']).optional(),
  verificationStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  bookingId: z.string().cuid().optional(),
  driverId: z.string().optional(),
  passengerId: z.string().optional(),
  limit: z.coerce.number().positive().default(20),
  offset: z.coerce.number().nonnegative().default(0),
});

module.exports = {
  createPaymentSchema,
  uploadReceiptSchema,
  verifyPaymentSchema,
  listPaymentsQuerySchema,
};