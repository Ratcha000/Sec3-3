const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const notifService = require('./notification.service');

// ================== CREATE REPORT ==================
const submitReport = async (reporterId, { reportedUserId, category, description }) => {
  const reportedUser = await prisma.user.findUnique({
    where: { id: reportedUserId }
  });

  if (!reportedUser) throw new ApiError(404, 'ไม่พบผู้ใช้ที่ระบุ');
  if (reporterId === reportedUserId) throw new ApiError(400, 'ไม่สามารถรายงานตัวเอง');

  return prisma.report.create({
    data: { reporterId, reportedUserId, category, description }
  });
};

// ================== LIST REPORT ==================
const listReports = async ({
  page = 1,
  limit = 10,
  status = 'pending',
  severity,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        reporter: true,
        reportedUser: true,
        admin: true
      }
    }),
    prisma.report.count({ where })
  ]);

  return {
    data: reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// ================== DETAIL ==================
const getReportDetail = async (reportId) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      reporter: true,
      reportedUser: true,
      admin: true
    }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');
  return report;
};

// ================== UPDATE STATUS ==================
const updateReportStatus = async (reportId, adminId, { status, adminNote }) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      adminNote,
      adminId,
      resolvedAt: status === 'resolved' ? new Date() : report.resolvedAt
    }
  });

  // แจ้งคนรายงาน
  await notifService.createNotificationByAdmin({
    userId: report.reporterId,
    type: 'REPORT_UPDATE',
    title: '📢 อัปเดตสถานะรายงานของคุณ',
    body: `รายงาน #${reportId.slice(-6)} ถูกเปลี่ยนสถานะเป็น ${status}`,
    relatedId: reportId
  });

  return updatedReport;
};

// ================== REVIEW ==================
const reviewReport = async (reportId, adminId, { severity, adminNote }) => {
  const blacklistService = require('./blacklist.service');

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { reportedUser: true }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'reviewed',
      severity,
      adminId,
      adminNote,
      resolvedAt: new Date()
    }
  });

  // แจ้งคนรายงาน
  await notifService.createNotificationByAdmin({
    userId: report.reporterId,
    type: 'REPORT_UPDATE',
    title: '📢 รายงานของคุณถูกตรวจสอบแล้ว',
    body: `หมวด ${report.category} → สถานะ: ${severity}`,
    relatedId: reportId
  });

  // ================== WARNING ==================
  if (severity === 'warning') {
    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'REPORT_WARNING',
      title: '⚠️ คุณได้รับคำเตือน',
      body: adminNote || 'คุณได้รับคำเตือนจากระบบ',
      relatedId: reportId
    });
  }

  // ================== BLACKLIST ==================
  if (severity === 'blacklist') {
    await blacklistService.blacklistNationalId(
      report.reportedUser.nationalIdNumber,
      adminId,
      { reason: adminNote, severity: 'blacklist' }
    );

    await prisma.user.update({
      where: { id: report.reportedUserId },
      data: {
        isBlacklisted: true,
        blacklistReason: adminNote,
        blacklistedAt: new Date()
      }
    });

    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'ACCOUNT_BANNED',
      title: '❌ บัญชีของคุณถูกแบน',
      body: adminNote || 'บัญชีของคุณถูกระงับ',
      relatedId: reportId
    });
  }

  return updatedReport;
};

// ================== SEND WARNING ==================
const sendWarningMessage = async (reportId, adminId, { subject, message }) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');

  // แจ้งผู้ถูกรายงาน
  await notifService.createNotificationByAdmin({
    userId: report.reportedUserId,
    type: 'REPORT_WARNING',
    title: subject,
    body: message,
    relatedId: reportId
  });

  // แจ้งกลับคนรายงาน
  await notifService.createNotificationByAdmin({
    userId: report.reporterId,
    type: 'REPORT_UPDATE',
    title: '📢 อัปเดตสถานะรายงาน',
    body: `แอดมินได้ส่งคำเตือนไปยังผู้ใช้แล้ว (หัวข้อ: ${subject})`,
    relatedId: reportId
  });

  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'resolved',
      adminId
    }
  });
};

// ================== BLACKLIST LIST ==================
const getBlacklistedUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [blacklist, total] = await Promise.all([
    prisma.blacklistedNationalId.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, username: true, email: true }
        }
      }
    }),
    prisma.blacklistedNationalId.count()
  ]);

  const users = await Promise.all(
    blacklist.map(b =>
      prisma.user.findFirst({
        where: { nationalIdNumber: b.nationalIdNumber }
      })
    )
  );

  const data = blacklist.map((b, i) => ({
    id: users[i]?.id || b.id,
    username: users[i]?.username || '-',
    email: users[i]?.email || '-',
    firstName: users[i]?.firstName || '-',
    lastName: users[i]?.lastName || '-',
    nationalIdNumber: b.nationalIdNumber,
    blacklistReason: b.reason,
    blacklistedAt: b.createdAt,
    admin: b.admin
  }));

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// ================== REMOVE BLACKLIST ==================
const removeBlacklist = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) throw new ApiError(404, 'ไม่พบผู้ใช้');

  await prisma.blacklistedNationalId.deleteMany({
    where: { nationalIdNumber: user.nationalIdNumber }
  });

  const still = await prisma.blacklistedNationalId.findFirst({
    where: { nationalIdNumber: user.nationalIdNumber }
  });

  if (!still) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlacklisted: false,
        blacklistReason: null,
        blacklistedAt: null
      }
    });
  }

  return { message: 'ลบ blacklist สำเร็จ' };
};

// ================== EXPORT ==================
module.exports = {
  submitReport,
  listReports,
  getReportDetail,
  updateReportStatus,
  reviewReport,
  sendWarningMessage,
  getBlacklistedUsers,
  removeBlacklist
};