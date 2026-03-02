const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const uploadToCloudinary = require('../utils/cloudinary');
const { performOCR } = require('../utils/ocr');
const fs = require('fs').promises;

// ============================================
// 1️⃣ สร้าง Payment ใหม่
// ============================================
/**
 * POST /api/payments
 * สร้างรายการชำระเงิน
 */
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, qrCodeUrl } = req.body;
    const userId = req.user.id;

    // ตรวจสอบ Booking มีอยู่ไหม
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        route: {
          include: { driver: true }
        },
        passenger: true,
        payments: true  // ✅ ดึง payments มา
      }
    });

    if (!booking) {
      throw new ApiError(404, 'ไม่พบรายการจอง');
    }

    // ✅ ตรวจสอบว่า Booking มี totalPrice ไหม
    if (!booking.totalPrice || booking.totalPrice === 0) {
      throw new ApiError(400, 'ราคารวมของการจองยังไม่ได้คำนวณ โปรดลองใหม่');
    }

    // ✅ ตรวจสอบว่า Payment มีอยู่แล้วไหม (status pending or completed)
    const existingPayment = booking.payments?.find(
      p => p.status === 'pending' || p.status === 'completed' || p.status === 'verified'
    );
    
    if (existingPayment) {
      // ✅ ถ้ามี payment pending/completed อยู่ → return ตัวเก่า
      return res.status(200).json({
        message: 'พบรายการชำระที่รอดำเนินการ',
        payment: existingPayment
      });
    }

    // ✅ ตรวจสอบว่าเป็นรายการจองที่ confirmed
    if (booking.status !== 'CONFIRMED') {
      throw new ApiError(400, 'รายการจองต้องอยู่ในสถานะยืนยันแล้ว');
    }

    // ✅ สร้าง Payment ใหม่ (เฉพาะครั้งแรกเท่านั้น)
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        driverId: booking.route.driver.id,
        passengerId: booking.passengerId,
        amount: booking.totalPrice,  // ✅ ใช้ totalPrice จาก booking
        status: 'pending',
        qrCodeUrl: qrCodeUrl || 'https://via.placeholder.com/300x300?text=QR+Code',
        verificationStatus: 'pending'
      },
      include: {
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        booking: {
          include: {
            route: {
              select: { startLocation: true, endLocation: true, pricePerSeat: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'สร้างรายการชำระสำเร็จ',
      payment
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถสร้างรายการชำระได้'
    });
  }
};

// ...existing code...

/**
 * GET /api/payments/passenger
 * ดึงรายการชำระของผู้โดยสาร (สำหรับ Frontend)
 */
exports.getPaymentsForPassenger = async (req, res) => {
  try {
    const passengerId = req.user.id;
    console.log('🔍 Getting payments for passenger:', passengerId);

    // ✅ ดึงรายการ payments พร้อมข้อมูลครบถ้วน
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          passengerId: passengerId
        }
      },
      include: {
        booking: {
          include: {
            route: {
              select: { 
                id: true, 
                startLocation: true, 
                endLocation: true, 
                pricePerSeat: true,
                departureTime: true,  // ✅ เปลี่ยนจาก departureDateTime เป็น departureTime
                status: true,
                distance: true,
                duration: true
              }
            },
            passenger: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        },
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Found payments:', payments.length);

    // ✅ ดึงข้อมูล driver payment info สำหรับแต่ละ payment
    for (let payment of payments) {
      if (payment.driver && payment.driver.id) {
        try {
          const driverProfile = await prisma.driverProfile.findUnique({
            where: { userId: payment.driver.id },
            select: {
              qrCodeUrl: true,
              bankInfo: true,
              paymentMethod: true
            }
          });

          if (driverProfile) {
            payment.driver.qrCodeUrl = driverProfile.qrCodeUrl;
            payment.driver.bankInfo = driverProfile.bankInfo;
            payment.driver.paymentMethod = driverProfile.paymentMethod;
          }
        } catch (err) {
          console.log(`No payment info for driver ${payment.driver.id}`);
        }
      }
    }

    // ✅ ส่ง response ในรูปแบบที่ frontend คาดหวัง
    res.status(200).json({
      message: 'ดึงรายการ payment สำเร็จ',
      data: payments
    });
  } catch (error) {
    console.error('❌ Get payments for passenger error:', error);
    res.status(500).json({
      message: error.message || 'ไม่สามารถดึงรายการ payment ได้',
      data: null
    });
  }
};

// ...existing code...


// ============================================
// 3️⃣ ดึงรายการชำระของ Driver
// ============================================
/**
 * GET /api/payments/driver/list
 * ดึงรายการชำระสำหรับคนขับ
 * Query: ?status=completed&verificationStatus=pending&limit=20&offset=0
 */
exports.getPaymentsForDriver = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, verificationStatus, limit = 20, offset = 0 } = req.query;

    const whereClause = {
      driverId: userId
    };

    // ✅ ถ้าไม่กำหนด status ให้ดึงเฉพาะ completed (มีสลิป มาแล้ว)
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'completed';
    }

    // ✅ ถ้ามี verificationStatus ให้กรองเพิ่มเติม
    if (verificationStatus) {
      whereClause.verificationStatus = verificationStatus;
    } else {
      whereClause.verificationStatus = 'pending';
    }

    // ✅ ดึงรายการชำระ
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        booking: {
          include: {
            route: {
              select: { id: true, startLocation: true, endLocation: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.payment.count({ where: whereClause });

    res.json({
      message: 'ดึงรายการชำระสำเร็จ',
      payments,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get Driver Payments Error:', error);
    res.status(500).json({
      message: error.message || 'ไม่สามารถดึงรายการชำระได้'
    });
  }
};

// ============================================
// 4️⃣ อัปโหลดรูปสลิป (Passenger)
// ============================================
/**
 * POST /api/payments/:paymentId/upload-receipt
 * อัปโหลดรูปสลิป + ข้อมูล
 * Body: FormData { receipt: File, amount: number, referenceNumber: string }
 */
exports.uploadReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, referenceNumber } = req.body;
    const receiptFile = req.file;

    // ✅ ตรวจสอบว่ามีรูปสลิป
    if (!receiptFile) {
      throw new ApiError(400, 'ต้องอัปโหลดรูปสลิป');
    }

    // ✅ ตรวจสอบจำนวนเงิน
    if (!amount) {
      throw new ApiError(400, 'ต้องกรอกจำนวนเงิน');
    }

    // ✅ ดึง Payment ก่อน
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true }
    });

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระ');
    }

    // ✅ อ่านไฟล์เป็น Buffer (แก้ไขปัญหา path → buffer)
    let fileBuffer;
    try {
      fileBuffer = await fs.readFile(receiptFile.path);
    } catch (err) {
      console.error('File read error:', err);
      throw new ApiError(400, 'ไม่สามารถอ่านไฟล์ได้');
    }

    // ✅ อัปโหลดไป Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(fileBuffer, 'payment_receipts');
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new ApiError(500, 'ไม่สามารถอัปโหลดรูปได้');
    }

    // ✅ ลบไฟล์ temp หลังจากอัปโหลดสำเร็จ
    try {
      await fs.unlink(receiptFile.path);
    } catch (err) {
      console.warn('Failed to delete temp file:', err);
    }

    const receiptImageUrl = uploadResult.secure_url;

    // ✅ ทำ OCR อ่านข้อความจากรูป
    let ocrText = '';
    let extractedData = {
      amount: parseFloat(amount),
      referenceNumber: referenceNumber || 'N/A',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      ocrText = await performOCR(receiptImageUrl);
      // ✅ ลอง extract ข้อมูลจากข้อความ OCR
      const amountMatch = ocrText.match(/(\d+(?:[,\.]\d{2})?)/);
      if (amountMatch) {
        extractedData.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
      }
    } catch (err) {
      console.warn('OCR error:', err);
      // ถ้า OCR ล้ม แต่ยังให้ผ่านต่อได้ (ใช้จำนวนเงินที่ user ป้อน)
    }

    // ✅ บันทึกการอัปโหลด
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        receiptImageUrl: receiptImageUrl,
        ocrData: extractedData,
        status: 'completed'  // ← เปลี่ยนสถานะเป็น completed เพื่อให้ Driver เห็น
      },
      include: {
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        booking: {
          include: {
            route: {
              select: { startLocation: true, endLocation: true }
            }
          }
        }
      }
    });

    // ✅ สร้าง Notification ส่งให้ Driver
    try {
      await prisma.notification.create({
        data: {
          userId: payment.driverId,
          title: 'มีการฝากชำระเงิน',
          message: `${payment.booking.passenger.firstName} ได้ฝากชำระเงิน ${payment.amount} บาท`,
          type: 'PAYMENT_RECEIPT_UPLOADED',
          relatedId: paymentId,
          read: false
        }
      });
    } catch (err) {
      console.warn('Failed to create notification:', err);
      // ไม่เป็นปัญหาถ้า notification ล้ม
    }

    res.json({
      message: 'อัปโหลดสลิปสำเร็จ รอการยืนยันจากคนขับ',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Upload Receipt Error:', error);
    
    // ✅ ลบ temp file ในกรณี error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.warn('Failed to delete temp file:', err);
      }
    }

    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถอัปโหลดสลิปได้'
    });
  }
};

// ============================================
// 5️⃣ ยืนยัน/ปฏิเสธการชำระ (Driver)
// ============================================
/**
 * PATCH /api/payments/:paymentId/verify
 * ยืนยัน/ปฏิเสธการชำระ
 * Body: { verificationStatus: "approved"|"rejected", verificationNote: string }
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { verificationStatus, verificationNote } = req.body;
    const userId = req.user.id;

    // ✅ ตรวจสอบค่า verificationStatus
    if (!['approved', 'rejected'].includes(verificationStatus)) {
      throw new ApiError(400, 'verificationStatus ต้องเป็น approved หรือ rejected');
    }

    // ✅ ดึง Payment ก่อน
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระ');
    }

    // ✅ ตรวจสอบว่า User คือ Driver ของรายการชำระนี้
    if (payment.driverId !== userId) {
      throw new ApiError(403, 'คุณไม่มีสิทธิ์ยืนยันรายการนี้');
    }

    // ✅ บันทึกการยืนยัน
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        verificationStatus: verificationStatus,
        verificationNote: verificationNote,
        status: verificationStatus === 'approved' ? 'verified' : 'rejected',
        verifiedAt: new Date()
      },
      include: {
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        booking: {
          include: {
            route: {
              select: { startLocation: true, endLocation: true }
            }
          }
        }
      }
    });

    // ✅ สร้าง Notification ส่งให้ Passenger
    const notificationMessage = verificationStatus === 'approved'
      ? `คนขับ ${payment.driver.firstName} ยืนยันการชำระ ${payment.amount} บาทเรียบร้อยแล้ว`
      : `คนขับปฏิเสธการชำระ${verificationNote ? ': ' + verificationNote : ''}`;

    try {
      await prisma.notification.create({
        data: {
          userId: payment.passengerId,
          title: verificationStatus === 'approved' ? 'ยืนยันการชำระสำเร็จ' : 'ปฏิเสธการชำระ',
          message: notificationMessage,
          type: verificationStatus === 'approved' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
          relatedId: paymentId,
          read: false
        }
      });
    } catch (err) {
      console.warn('Failed to create notification:', err);
    }

    res.json({
      message: `${verificationStatus === 'approved' ? 'ยืนยัน' : 'ปฏิเสธ'}การชำระสำเร็จ`,
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถบันทึกการยืนยันได้'
    });
  }
};

// ============================================
// 6️⃣ ดึงข้อมูล Payment รายตัว (เพิ่มเติม)
// ============================================
/**
 * GET /api/payments/:paymentId
 * ดึงข้อมูล Payment รายตัว
 */
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        booking: {
          include: {
            route: {
              select: { startLocation: true, endLocation: true }
            }
          }
        }
      }
    });

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระ');
    }

    res.json({
      message: 'ดึงข้อมูลสำเร็จ',
      payment
    });
  } catch (error) {
    console.error('Get Payment Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถดึงข้อมูลได้'
    });
  }
};

/**
 * POST /api/payments/:id/cash-confirm
 * ผู้โดยสารยืนยันการชำระเงินสด
 */
exports.confirmCashPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params
    const passengerId = req.user.id

    console.log('💵 Cash payment confirmation:', { paymentId, passengerId })

    // ตรวจสอบ payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { 
        booking: {
          include: {
            route: true,
            passenger: true
          }
        },
        driver: true 
      }
    })

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระเงิน')
    }

    if (payment.booking.passengerId !== passengerId) {
      throw new ApiError(403, 'ไม่มีสิทธิ์เข้าถึงรายการชำระเงินนี้')
    }

    if (payment.status !== 'pending') {
      throw new ApiError(400, 'รายการชำระเงินนี้ไม่สามารถเปลี่ยนแปลงได้')
    }

    // อัปเดตสถานะเป็น cash_pending (รอคนขับยืนยัน)
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentMethod: 'cash',
        status: 'cash_pending',
        submittedAt: new Date()
      },
      include: {
        booking: {
          include: {
            route: true,
            passenger: true
          }
        },
        driver: true
      }
    })

    console.log('✅ Cash payment confirmed:', updatedPayment.id)

    res.status(200).json({
      message: 'ยืนยันการชำระเงินสดสำเร็จ รอคนขับยืนยัน',
      data: updatedPayment
    })
  } catch (error) {
    console.error('❌ Confirm cash payment error:', error)
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถยืนยันการชำระเงินสดได้'
    })
  }
}

/**
 * POST /api/payments/:id/driver-confirm-cash
 * คนขับยืนยันการรับเงินสด
 */
exports.driverConfirmCash = async (req, res) => {
  try {
    const { id: paymentId } = req.params
    const driverId = req.user.id
    const { confirmed } = req.body // true = ยืนยัน, false = ปฏิเสธ

    console.log('👨‍✈️ Driver cash confirmation:', { paymentId, driverId, confirmed })

    // ตรวจสอบ payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { 
        booking: {
          include: {
            route: true,
            passenger: true
          }
        }
      }
    })

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระเงิน')
    }

    if (payment.driverId !== driverId) {
      throw new ApiError(403, 'ไม่มีสิทธิ์เข้าถึงรายการชำระเงินนี้')
    }

    if (payment.status !== 'cash_pending') {
      throw new ApiError(400, 'รายการนี้ไม่ใช่การชำระเงินสดที่รอยืนยัน')
    }

    const newStatus = confirmed ? 'verified' : 'rejected'
    const verificationNote = confirmed ? 'ยืนยันการรับเงินสดแล้ว' : 'ปฏิเสธการรับเงินสด'
    
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newStatus,
        verificationStatus: confirmed ? 'approved' : 'rejected',
        verifiedAt: confirmed ? new Date() : null,
        verificationNote: verificationNote
      },
      include: {
        booking: {
          include: {
            route: true,
            passenger: true
          }
        },
        driver: true
      }
    })

    console.log('✅ Driver cash confirmation:', updatedPayment.id, newStatus)

    res.status(200).json({
      message: confirmed ? 'ยืนยันการรับเงินสดสำเร็จ' : 'ปฏิเสธการรับเงินสด',
      data: updatedPayment
    })
  } catch (error) {
    console.error('❌ Driver confirm cash error:', error)
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถยืนยันการรับเงินสดได้'
    })
  }
}