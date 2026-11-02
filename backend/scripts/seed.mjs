import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=== BẮT ĐẦU KHỞI TẠO DỮ LIỆU MẪU LUK SERVICES (DEMO SEED) ===');

  // 1. Cấu hình ngân hàng VietQR mặc định
  const bankSetting = await prisma.bankSetting.upsert({
    where: { id: 'default' },
    update: {
      bankName: 'MB Bank (Ngân hàng Quân đội)',
      bankCode: 'MB',
      accountNumber: '0988888888',
      accountHolder: 'LUK SERVICES',
      branch: 'Chi nhánh Hà Nội',
      qrTemplate: 'compact2',
      isDepositAllowed: true,
      defaultDepositPercent: 50,
      transferNotePrefix: 'LUK',
    },
    create: {
      id: 'default',
      bankName: 'MB Bank (Ngân hàng Quân đội)',
      bankCode: 'MB',
      accountNumber: '0988888888',
      accountHolder: 'LUK SERVICES',
      branch: 'Chi nhánh Hà Nội',
      qrTemplate: 'compact2',
      isDepositAllowed: true,
      defaultDepositPercent: 50,
      transferNotePrefix: 'LUK',
    },
  });
  console.log('✓ Cấu hình ngân hàng & VietQR:', bankSetting.bankName);

  // 2. Tài khoản Quản trị viên (Admin)
  const adminPasswordHash = await bcrypt.hash('AdminLuk@2026!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lukglobal.vn' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      name: 'LUK Global Admin',
      phone: '0988888888',
    },
    create: {
      email: 'admin@lukglobal.vn',
      name: 'LUK Global Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '0988888888',
    },
  });
  console.log('✓ Tài khoản Admin hệ thống:', adminUser.email);

  // 3. Khởi tạo 8 Tài khoản Khách hàng mẫu (Sinh viên LUK Global)
  const studentPasswordHash = await bcrypt.hash('Student@2026!', 10);
  const demoCustomersData = [
    { email: 'student@lukglobal.vn', name: 'Nguyễn Hoàng Long (LUKer)', phone: '0901234567' },
    { email: 'student.trang@lukglobal.vn', name: 'Phạm Thu Trang (FTU)', phone: '0912345678' },
    { email: 'student.bao@lukglobal.vn', name: 'Lê Quốc Bảo (RMIT)', phone: '0923456789' },
    { email: 'student.maianh@lukglobal.vn', name: 'Trần Mai Anh (NEU)', phone: '0934567890' },
    { email: 'student.quan@lukglobal.vn', name: 'Đặng Minh Quân (HUST)', phone: '0945678901' },
    { email: 'student.yen@lukglobal.vn', name: 'Vũ Hải Yến (DAV)', phone: '0956789012' },
    { email: 'student.dat@lukglobal.vn', name: 'Ngô Thành Đạt (UEH)', phone: '0967890123' },
    { email: 'student.linh@lukglobal.vn', name: 'Bùi Khánh Linh (ULIS)', phone: '0978901234' },
  ];

  const demoCustomers = [];
  for (const c of demoCustomersData) {
    const u = await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name, phone: c.phone, role: 'USER', passwordHash: studentPasswordHash },
      create: { email: c.email, name: c.name, phone: c.phone, role: 'USER', passwordHash: studentPasswordHash },
    });
    demoCustomers.push(u);
  }
  console.log(`✓ Đã khởi tạo ${demoCustomers.length} tài khoản khách hàng sinh viên mẫu`);

  // 4. Danh mục Dịch vụ sinh viên LUK Services (4 Nhóm Trọng Tâm chuẩn hoá)
  const servicesData = [
    // ========================================================
    // 1. EDIT VIDEO (4 dịch vụ theo yêu cầu)
    // ========================================================
    {
      title: 'Edit video Project nhóm',
      slug: 'edit-video-project-nhom',
      category: 'VIDEO_EDITING',
      shortDescription: 'Biên tập video đồ án môn học nhóm, cắt dựng tiết tấu mượt mà, chèn subtitle và sound effect chuẩn điểm cao.',
      description: 'Dành cho bài tập nhóm, đồ án môn học đại học. Dựng timeline chuyên nghiệp, phối hợp footage của các thành viên, cân bằng âm lượng giọng nói, lồng nhạc nền và phụ đề sinh động.',
      startingPrice: 150000,
      turnaround: '24-48 giờ',
      deliveryFormat: 'MP4 1080p/4K, Drive link bàn giao',
      imageUrl: '/images/services/edit-video-project-nhom.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'project nhóm, video đồ án, thuyết trình, edit video, fptu',
      isDemo: true,
      sortOrder: 1,
    },
    {
      title: 'Edit Video Project cá nhân (Check2)',
      slug: 'edit-video-project-ca-nhan',
      category: 'VIDEO_EDITING',
      shortDescription: 'Dựng video bài thuyết trình cá nhân, portfolio Check 2, lọc ồn giọng nói, chèn visual cue và chuyển cảnh mượt.',
      description: 'Dành riêng cho sinh viên thực hiện bài kiểm tra cá nhân, Check 2 hoặc portfolio kỹ năng. Cắt ghép đoạn nói mượt mà, chèn hình ảnh minh họa đúng nhịp, lọc ồn giọng nói trong trẻo.',
      startingPrice: 150000,
      turnaround: '24 giờ',
      deliveryFormat: 'MP4 Full HD, Phụ đề chuẩn',
      imageUrl: '/images/services/edit-video-project-ca-nhan.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'project cá nhân, check 2, presentation, video portfolio',
      isDemo: true,
      sortOrder: 2,
    },
    {
      title: 'Edit video Debate',
      slug: 'edit-video-debate',
      category: 'VIDEO_EDITING',
      shortDescription: 'Biên tập video tranh biện chuẩn format BP / World Universities Debating, ghép phông studio tin tức, canh timing chuẩn xác.',
      description: 'Biên tập các trận tranh biện chuyên sâu, video phân vai người nói, ghép phông tin tức trường quay Global News sắc nét, đồng bộ bảng điểm và đồng hồ bấm giờ tranh biện.',
      startingPrice: 450000,
      turnaround: '2-3 ngày',
      deliveryFormat: 'MP4 1080p/4K chuyên nghiệp',
      imageUrl: '/images/services/edit-video-debate.jpg',
      isFeatured: true,
      isPopular: false,
      tags: 'debate, tranh biện bp, video debate, tin tức, global news',
      isDemo: true,
      sortOrder: 3,
    },
    {
      title: 'Edit MV presentation',
      slug: 'edit-mv-presentation',
      category: 'VIDEO_EDITING',
      shortDescription: 'Sản xuất và dựng music video thuyết trình sáng tạo, motion lyrics sinh động, hiệu ứng âm thanh và ánh sáng chuẩn sân khấu.',
      description: 'Dành cho các bài thi sáng tạo nghệ thuật, video ca nhạc giới thiệu đồ án hoặc tiết mục ngoại khóa. Dựng nhịp nhạc chuẩn từng beat, hiệu ứng kinetic lyrics và phân cảnh điện ảnh bắt mắt.',
      startingPrice: 150000,
      turnaround: '24-48 giờ',
      deliveryFormat: 'MP4 4K, Project file & Lyrics',
      imageUrl: '/images/services/edit-mv-presentation.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'mv presentation, music video, sáng tạo, lyrics, đồ án môn học',
      isDemo: true,
      sortOrder: 4,
    },

    // ========================================================
    // 2. EDIT SLIDE (2 dịch vụ theo yêu cầu)
    // ========================================================
    {
      title: 'Edit Slide Project Presentation',
      slug: 'edit-slide-project-presentation',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Thiết kế slide đồ án nhóm, báo cáo môn học và trình chiếu dự án sinh viên chuẩn visual, sơ đồ hóa dữ liệu trực quan.',
      description: 'Chuyển hóa nội dung thô thành bài thuyết trình dự án cuốn hút. Bố cục slide 16:9 hiện đại, biểu tượng trực quan, phân chia phần việc rõ ràng cho từng thành viên nhóm.',
      startingPrice: 100000,
      turnaround: '24 giờ',
      deliveryFormat: 'PPTX, PDF, Google Slides/Canva link',
      imageUrl: '/images/services/edit-slide-project-presentation.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'edit slide, presentation, teamwork, đồ án môn học, fptu',
      isDemo: true,
      sortOrder: 5,
    },
    {
      title: 'Edit Slide debate',
      slug: 'edit-slide-debate',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Thiết kế slide tranh biện BP, infographic luận điểm, trực quan hóa case study đối kháng thuyết phục ban giám khảo.',
      description: 'Thiết kế chuyên sâu cho tranh biện và hùng biện Public Speaking. Trực quan hóa luận điểm ủng hộ/phản đối, sơ đồ tác động kinh tế xã hội, tạo điểm nhấn áp đảo trên sân khấu.',
      startingPrice: 250000,
      turnaround: '24-48 giờ',
      deliveryFormat: 'PPTX & PDF in ấn / trình chiếu',
      imageUrl: '/images/services/edit-slide-debate.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'slide debate, public speaking, tranh biện, infographic',
      isDemo: true,
      sortOrder: 6,
    },

    // ========================================================
    // 3. VIẾT KỊCH BẢN (TRANSCRIPT) (3 dịch vụ theo yêu cầu)
    // ========================================================
    {
      title: 'Edit transcript project nhóm',
      slug: 'edit-transcript-project-nhom',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Gỡ băng, biên tập transcript chi tiết bài thuyết trình project nhóm, format chuẩn nộp giảng viên.',
      description: 'Biên tập gỡ băng và chuẩn hóa transcript cho đồ án, bài tập nhóm đại học. Tách lời thoại từng thành viên, chuẩn hóa chính tả thuật ngữ tiếng Anh, định dạng bảng câu hỏi và câu trả lời chỉn chu.',
      startingPrice: 50000,
      turnaround: '12-24 giờ',
      deliveryFormat: 'File Word DOCX & PDF chuẩn nộp',
      imageUrl: '/images/services/edit-transcript-project-nhom.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'transcript project nhóm, gỡ băng, check 2, đồ án nhóm, fptu',
      isDemo: true,
      sortOrder: 7,
    },
    {
      title: 'Edit transcript check 2',
      slug: 'edit-transcript-check-2',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Chuẩn hóa kịch bản transcript Check 2, khớp yêu cầu trình bày 5 bước, chuẩn phụ đề tiếng Anh.',
      description: 'Biên tập transcript cho bài kiểm tra Check 2 cá nhân. Tối ưu cấu trúc câu từ, khớp thời lượng nói, đối soát chính xác phụ đề tiếng Anh và tiêu chí chấm điểm của giảng viên.',
      startingPrice: 50000,
      turnaround: '12 giờ',
      deliveryFormat: 'File DOCX & File SRT phụ đề',
      imageUrl: '/images/services/edit-transcript-check-2.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'transcript check 2, presentation cá nhân, speaking, fptu',
      isDemo: true,
      sortOrder: 8,
    },
    {
      title: 'Viết kịch bản thuyết trình',
      slug: 'viet-kich-ban-thuyet-trinh',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Viết kịch bản video essay, bài thuyết trình thuyết phục từ 50k - 100k, phân vai và canh timeline chuẩn.',
      description: 'Xây dựng kịch bản thuyết trình chi tiết từ outline thô. Lên cấu trúc mở đầu, thân bài, kết luận ấn tượng, bổ sung dẫn chứng thực tế, phân chia câu thoại mượt mà cho các thành viên.',
      startingPrice: 50000,
      turnaround: '24 giờ',
      deliveryFormat: 'File DOCX kịch bản + Timeline chi tiết',
      imageUrl: '/images/services/viet-kich-ban-thuyet-trinh.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'viết kịch bản thuyết trình, video essay, outline, speaking',
      isDemo: true,
      sortOrder: 9,
    },

    // ========================================================
    // 4. DEBATE (2 dịch vụ theo yêu cầu)
    // ========================================================
    {
      title: 'Debate Evidence',
      slug: 'debate-evidence',
      category: 'DEBATE_RESOURCES',
      shortDescription: 'Bộ số liệu, case study và dẫn chứng xác thực (Fact-based Evidence) cho các motion tranh biện hot.',
      description: 'Tổng hợp luận cứ, dữ liệu thống kê, báo cáo thực nghiệm và nghiên cứu quốc tế hỗ trợ cả 2 phe Chính phủ (Gov) và Đối lập (Opp). Tùy chọn Motion phong cách Shopee (Facebook, Fast Fashion, AI...).',
      startingPrice: 50000,
      turnaround: 'Giao ngay lập tức',
      deliveryFormat: 'PDF & Notion Database tra cứu dẫn chứng',
      imageUrl: '/images/services/debate-evidence.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'debate evidence, dẫn chứng tranh biện, motion facebook, fast fashion',
      isDemo: true,
      sortOrder: 10,
    },
    {
      title: 'Debate Solution',
      slug: 'debate-solution',
      category: 'DEBATE_RESOURCES',
      shortDescription: 'Hệ thống giải pháp, cơ chế chính sách (Policy & Mechanism) và phân tầng luận điểm giải quyết vấn đề.',
      description: 'Xây dựng khung Model/Policy vững chắc, giải quyết triệt để vấn đề gốc rễ, phản biện lại các tác động tiêu cực (harm vs benefit). Tùy chọn Motion phong cách Shopee (Facebook, Fast Fashion, AI...).',
      startingPrice: 50000,
      turnaround: 'Giao ngay lập tức',
      deliveryFormat: 'PDF & Bản đồ tư duy chiến thuật tranh biện',
      imageUrl: '/images/services/debate-solution.jpg',
      isFeatured: true,
      isPopular: true,
      tags: 'debate solution, giải pháp tranh biện, cơ chế, policy',
      isDemo: true,
      sortOrder: 11,
    },
  ];

  const validSlugs = servicesData.map((s) => s.slug);
  await prisma.service.updateMany({
    where: { slug: { notIn: validSlugs } },
    data: { isActive: false },
  });

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, isActive: true },
      create: { ...s, isActive: true },
    });
  }
  console.log(`✓ Đã tạo/cập nhật ${servicesData.length} dịch vụ trọng tâm trên 4 danh mục LUK Services (các dịch vụ cũ đã hủy kích hoạt)`);

  // 5. Thư viện Debate (Đã tối giản để tập trung 4 danh mục trọng tâm)
  const debateResourcesData = [];
  for (const r of debateResourcesData) {
    await prisma.debateResource.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }

  // 6. Khởi tạo 18 Đơn hàng mẫu trải đều 10 trạng thái luồng nghiệp vụ
  console.log('--- Khởi tạo 18 đơn hàng mẫu trải dài toàn bộ trạng thái luồng nghiệp vụ ---');

  const allDbServices = await prisma.service.findMany();
  const getService = (slug) => allDbServices.find((s) => s.slug === slug) || allDbServices[0];

  const orderTemplates = [
    // 1. PENDING_REVIEW (2 orders)
    {
      code: 'LUK-2610-1001',
      customerIdx: 0,
      serviceSlug: 'edit-video-project-nhom',
      status: 'PENDING_REVIEW',
      notes: 'Video thuyết trình đồ án nhóm môn học, footage quay bằng điện thoại & máy ảnh khoảng 15GB.',
      deadlineDays: 5,
    },
    {
      code: 'LUK-2610-1002',
      customerIdx: 1,
      serviceSlug: 'edit-slide-project-presentation',
      status: 'PENDING_REVIEW',
      notes: 'Cần dàn trang bài thuyết trình môn Quản trị chiến lược, nhóm có 4 thành viên.',
      deadlineDays: 4,
    },

    // 2. IN_REVIEW (2 orders)
    {
      code: 'LUK-2610-2001',
      customerIdx: 2,
      serviceSlug: 'edit-transcript-project-nhom',
      status: 'IN_REVIEW',
      notes: 'Gỡ băng và biên tập transcript thuyết trình đồ án nhóm, tổng thời lượng 45 phút.',
      deadlineDays: 3,
    },
    {
      code: 'LUK-2610-2002',
      customerIdx: 3,
      serviceSlug: 'edit-slide-debate',
      status: 'IN_REVIEW',
      notes: 'Đội thi lọt vào bán kết tranh biện BP, cần tút lại 12 trang slide luận điểm đối kháng.',
      deadlineDays: 4,
    },

    // 3. QUOTED (2 orders)
    {
      code: 'LUK-2610-3001',
      customerIdx: 4,
      serviceSlug: 'debate-evidence',
      status: 'QUOTED',
      quotedPrice: 50000,
      depositRequired: 50000,
      notes: 'Tài liệu Debate Evidence cho Motion Fast Fashion và Trí tuệ nhân tạo.',
      deadlineDays: 1,
      quoteNotes: 'Báo giá tài liệu Debate Evidence 50.000₫/bộ, giao ngay sau khi thanh toán VietQR.',
    },
    {
      code: 'LUK-2610-3002',
      customerIdx: 5,
      serviceSlug: 'edit-transcript-check-2',
      status: 'QUOTED',
      quotedPrice: 50000,
      depositRequired: 50000,
      notes: 'Biên tập transcript Check 2 cá nhân, kiểm tra tiêu chí 5 bước và phụ đề tiếng Anh.',
      deadlineDays: 2,
      quoteNotes: 'Báo giá 50.000₫ gồm file DOCX và phụ đề SRT chuẩn.',
    },

    // 4. AWAITING_PAYMENT (2 orders)
    {
      code: 'LUK-2610-4001',
      customerIdx: 6,
      serviceSlug: 'san-xuat-video-motion-graphics-do-an',
      status: 'AWAITING_PAYMENT',
      quotedPrice: 650000,
      depositRequired: 300000,
      notes: 'Video giải thích cơ chế Blockchain cho đồ án Công nghệ tài chính Fintech.',
      deadlineDays: 5,
      quoteNotes: 'Khách đã đồng ý báo giá. Vui lòng chuyển khoản đặt cọc 300.000₫ theo mã VietQR bên dưới.',
    },
    {
      code: 'LUK-2610-4002',
      customerIdx: 7,
      serviceSlug: 'tai-khoan-chatgpt-plus-team',
      status: 'AWAITING_PAYMENT',
      quotedPrice: 199000,
      depositRequired: 199000,
      notes: 'Tài khoản ChatGPT Plus dùng chung nhóm nghiên cứu 3 người.',
      deadlineDays: 1,
      quoteNotes: 'Vui lòng quét mã VietQR bên dưới thanh toán 199.000₫ để kích hoạt ngay.',
    },

    // 5. PAYMENT_CONFIRMED (2 orders)
    {
      code: 'LUK-2610-5001',
      customerIdx: 0,
      serviceSlug: 'thiet-ke-slide-bao-ve-khoa-luan-tot-nghiep',
      status: 'PAYMENT_CONFIRMED',
      quotedPrice: 350000,
      depositRequired: 175000,
      notes: 'Slide bảo vệ khóa luận ngành Tài chính Doanh nghiệp, hội đồng trường NEU.',
      deadlineDays: 4,
      paymentAmount: 175000,
      paymentNotes: 'Khách đã chuyển cọc 175k qua MB Bank. Admin đã đối soát tài khoản thực tế thành công.',
    },
    {
      code: 'LUK-2610-5002',
      customerIdx: 1,
      serviceSlug: 'tai-khoan-gemini-advanced-2tb',
      status: 'PAYMENT_CONFIRMED',
      quotedPrice: 149000,
      depositRequired: 149000,
      notes: 'Tài khoản Google Gemini Advanced kèm 2TB Google Drive lưu trữ dữ liệu đồ án.',
      deadlineDays: 1,
      paymentAmount: 149000,
      paymentNotes: 'Khách thanh toán 100% (149.000₫). Admin đã xác nhận dòng tiền về tài khoản MB.',
    },

    // 6. IN_PROGRESS (2 orders)
    {
      code: 'LUK-2610-6001',
      customerIdx: 2,
      serviceSlug: 'edit-video-thuyet-trinh-bai-giang',
      status: 'IN_PROGRESS',
      quotedPrice: 250000,
      depositRequired: 150000,
      notes: 'Cắt ghép video bài thuyết trình môn Kinh tế vi mô, bổ sung motion title.',
      deadlineDays: 3,
      paymentAmount: 150000,
      paymentNotes: 'Đã nhận cọc. Team dựng video đang thực hiện timeline v1.',
    },
    {
      code: 'LUK-2610-6002',
      customerIdx: 3,
      serviceSlug: 'bien-tap-chuan-hoa-transcript',
      status: 'IN_PROGRESS',
      quotedPrice: 180000,
      depositRequired: 90000,
      notes: 'Chuẩn hóa format transcript 3 cuộc phỏng vấn sâu, gắn nhãn Speaker A/B.',
      deadlineDays: 2,
      paymentAmount: 90000,
      paymentNotes: 'Đang chạy style headings và chuẩn hóa các mốc thời gian.',
    },

    // 7. DRAFT_DELIVERED (2 orders)
    {
      code: 'LUK-2610-7001',
      customerIdx: 4,
      serviceSlug: 'dung-video-gioi-thieu-ban-than-cv',
      status: 'DRAFT_DELIVERED',
      quotedPrice: 300000,
      depositRequired: 150000,
      notes: 'Video profile giới thiệu bản thân 90 giây ứng tuyển học bổng trao đổi.',
      deadlineDays: 2,
      paymentAmount: 150000,
      draftTitle: 'Bản dựng nháp video profile v1',
      draftPreview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      draftNotes: 'Admin đã dựng nháp timeline 90 giây, chèn title giới thiệu và nhạc nền.',
    },
    {
      code: 'LUK-2610-7002',
      customerIdx: 5,
      serviceSlug: 'tao-phu-de-noi-auto-caption',
      status: 'DRAFT_DELIVERED',
      quotedPrice: 120000,
      depositRequired: 60000,
      notes: 'Tạo auto-caption dạng chữ nhảy động phong cách TikTok cho 3 video đồ án.',
      deadlineDays: 2,
      paymentAmount: 60000,
      draftTitle: 'Bản xuất thử nghiệm 1 video đầu tiên',
      draftNotes: 'Đã đồng bộ chữ nhảy hoạt họa từng từ. Mời bạn kiểm tra màu chữ và hiệu ứng highlight.',
    },

    // 8. AWAITING_FEEDBACK (1 order)
    {
      code: 'LUK-2610-8001',
      customerIdx: 6,
      serviceSlug: 'thiet-ke-slide-thuyet-trinh-hoc-thuat',
      status: 'AWAITING_FEEDBACK',
      quotedPrice: 220000,
      depositRequired: 110000,
      notes: 'Slide môn Kế toán tài chính quốc tế IFRS.',
      deadlineDays: 2,
      paymentAmount: 110000,
      draftTitle: 'Bản thảo toàn bộ slide v1 (24 trang)',
      draftNotes: 'Admin đã xuất file PDF bản nháp kèm watermark. Mời bạn kiểm tra thứ tự nội dung và gửi góp ý.',
    },

    // 9. REVISING (1 order)
    {
      code: 'LUK-2610-8002',
      customerIdx: 7,
      serviceSlug: 'edit-video-recap-su-kien-clb',
      status: 'REVISING',
      quotedPrice: 380000,
      depositRequired: 200000,
      notes: 'Video teambuilding CLB Tình nguyện tại Ba Vì.',
      deadlineDays: 2,
      paymentAmount: 200000,
      draftTitle: 'Bản dựng v1',
      revisionFeedback: 'Khách yêu cầu đổi đoạn nhạc nền ở phút 01:20 sang bài sôi động hơn và thêm tên ban chủ nhiệm ở credit cuối.',
    },

    // 10. COMPLETED (3 orders with verified reviews)
    {
      code: 'LUK-2610-9001',
      customerIdx: 0,
      serviceSlug: 'thiet-ke-slide-thuyet-trinh-hoc-thuat',
      status: 'COMPLETED',
      quotedPrice: 200000,
      depositRequired: 100000,
      notes: 'Slide môn Kinh tế lượng, tone màu xanh than lịch sự.',
      deadlineDays: 1,
      paymentAmount: 200000,
      draftTitle: 'Bản bàn giao chính thức hoàn thiện (Final Deliverable)',
      isFinal: true,
      review: {
        rating: 5,
        comment: 'Slide làm rất đẹp và chuyên nghiệp, đúng tông màu xanh navy của trường. Thầy cô chấm điểm bài thuyết trình khen sơ đồ hóa số liệu rất rõ ràng. Cảm ơn team LUK Services rất nhiều!',
      },
    },
    {
      code: 'LUK-2610-9002',
      customerIdx: 1,
      serviceSlug: 'tai-khoan-canva-pro-ban-quyen',
      status: 'COMPLETED',
      quotedPrice: 120000,
      depositRequired: 120000,
      notes: 'Gói Canva Pro sinh viên 1 năm nâng cấp trực tiếp email edu.',
      deadlineDays: 1,
      paymentAmount: 120000,
      draftTitle: 'Xác nhận kích hoạt bản quyền Canva Pro 1 năm',
      isFinal: true,
      review: {
        rating: 5,
        comment: 'Kích hoạt tài khoản Canva Pro cực nhanh chỉ trong 5 phút! Đầy đủ font tiếng Việt và thư viện hình ảnh premium để làm slide thuyết trình. Đánh giá 5 sao!',
      },
    },
    {
      code: 'LUK-2610-9003',
      customerIdx: 2,
      serviceSlug: 'edit-video-thuyet-trinh-bai-giang',
      status: 'COMPLETED',
      quotedPrice: 250000,
      depositRequired: 250000,
      notes: 'Video thuyết trình môn Luật kinh tế.',
      deadlineDays: 1,
      paymentAmount: 250000,
      draftTitle: 'Video hoàn thiện MP4 1080p + File phụ đề SRT',
      isFinal: true,
      review: {
        rating: 5,
        comment: 'Biên tập cắt ghép rất mượt, âm thanh lọc sạch tiếng quạt phòng học. Giao file đúng hạn cam kết trước nửa ngày. Chắc chắn sẽ quay lại ủng hộ!',
      },
    },

    // 11. CANCELLED (1 order with reason)
    {
      code: 'LUK-2610-9999',
      customerIdx: 3,
      serviceSlug: 'go-bang-bien-ban-hop-clb',
      status: 'CANCELLED',
      notes: 'Khách yêu cầu hủy do buổi họp CLB được hoãn sang tháng sau.',
      deadlineDays: 3,
    },
  ];

  for (const ot of orderTemplates) {
    const cust = demoCustomers[ot.customerIdx];
    const srv = getService(ot.serviceSlug);

    const existing = await prisma.order.findUnique({
      where: { orderCode: ot.code },
    });

    if (existing) {
      continue;
    }

    const requestedDeadline = new Date(Date.now() + ot.deadlineDays * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderCode: ot.code,
        userId: cust.id,
        guestName: cust.name,
        guestEmail: cust.email,
        guestPhone: cust.phone || '0900000000',
        status: ot.status,
        quotedPrice: ot.quotedPrice || srv.startingPrice || 200000,
        depositRequired: ot.depositRequired || null,
        requestedDeadline,
        generalNotes: ot.notes,
        items: {
          create: [
            {
              serviceId: srv.id,
              serviceTitleSnapshot: srv.title,
              unitPriceSnapshot: srv.startingPrice,
              quantity: 1,
              itemNotes: ot.notes,
            },
          ],
        },
      },
    });

    // 1. Audit log khởi tạo
    await prisma.auditLog.create({
      data: {
        orderId: order.id,
        entityType: 'ORDER',
        entityId: order.orderCode,
        action: 'ORDER_CREATED',
        actorId: cust.id,
        actorRole: 'CUSTOMER',
        detailsJson: JSON.stringify({ note: 'Đơn hàng khởi tạo mẫu trong seed' }),
      },
    });

    // 2. Nếu đơn đã có báo giá
    if (ot.quotedPrice) {
      await prisma.quote.create({
        data: {
          orderId: order.id,
          totalPrice: ot.quotedPrice,
          depositAmount: ot.depositRequired || 0,
          confirmedDeadline: requestedDeadline,
          paymentNotes: ot.quoteNotes || 'Báo giá chuẩn dịch vụ LUK Services.',
          status: ot.status === 'QUOTED' ? 'SENT' : 'ACCEPTED',
          createdByAdminId: adminUser.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          orderId: order.id,
          entityType: 'QUOTE',
          entityId: order.orderCode,
          action: 'SUBMIT_QUOTE',
          actorId: adminUser.id,
          actorRole: 'ADMIN',
          detailsJson: JSON.stringify({ totalPrice: ot.quotedPrice, deposit: ot.depositRequired }),
        },
      });
    }

    // 3. Nếu đơn có thanh toán
    if (ot.paymentAmount) {
      const isConfirmed = [
        'PAYMENT_CONFIRMED',
        'IN_PROGRESS',
        'DRAFT_DELIVERED',
        'AWAITING_FEEDBACK',
        'REVISING',
        'COMPLETED',
      ].includes(ot.status);

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: ot.paymentAmount,
          paymentType: ot.paymentAmount === ot.quotedPrice ? 'FULL' : 'DEPOSIT',
          paymentStatus: isConfirmed ? 'CONFIRMED' : 'PENDING_CONFIRMATION',
          bankName: bankSetting.bankName,
          accountNumber: bankSetting.accountNumber,
          accountHolder: bankSetting.accountHolder,
          transferContent: `${bankSetting.transferNotePrefix} ${order.orderCode}`,
          proofNotes: ot.paymentNotes || 'Biên lai chuyển khoản mẫu VietQR',
          confirmedAt: isConfirmed ? new Date() : null,
          confirmedByUserId: isConfirmed ? adminUser.id : null,
          adminNotes: isConfirmed ? 'Admin đã kiểm tra giao dịch tài khoản MB khớp lệnh' : null,
        },
      });

      if (isConfirmed) {
        await prisma.auditLog.create({
          data: {
            orderId: order.id,
            entityType: 'PAYMENT',
            entityId: order.orderCode,
            action: 'CONFIRM_PAYMENT_MANUAL',
            actorId: adminUser.id,
            actorRole: 'ADMIN',
            detailsJson: JSON.stringify({ amount: ot.paymentAmount, method: 'MB_VIETQR' }),
          },
        });
      }
    }

    // 4. Nếu đơn có bản thảo (Draft)
    if (ot.draftTitle) {
      const draft = await prisma.draftVersion.create({
        data: {
          orderId: order.id,
          versionNumber: 1,
          versionType: ot.isFinal ? 'FINAL' : 'DRAFT',
          title: ot.draftTitle,
          notes: ot.draftNotes || 'Bản nháp gửi khách duyệt.',
          previewUrl: ot.draftPreview || null,
          fileName: `${ot.code}-v1.pdf`,
          fileSize: 2048576,
          mimeType: 'application/pdf',
          canDownload: true,
          isFinal: Boolean(ot.isFinal),
          createdByAdminId: adminUser.id,
        },
      });

      if (ot.revisionFeedback) {
        await prisma.feedback.create({
          data: {
            orderId: order.id,
            draftVersionId: draft.id,
            authorRole: 'CUSTOMER',
            authorName: cust.name,
            content: ot.revisionFeedback,
            revisionRequested: true,
          },
        });

        await prisma.auditLog.create({
          data: {
            orderId: order.id,
            entityType: 'DRAFT',
            entityId: draft.id,
            action: 'CUSTOMER_REVISION_REQUESTED',
            actorId: cust.id,
            actorRole: 'CUSTOMER',
            detailsJson: JSON.stringify({ feedback: ot.revisionFeedback }),
          },
        });
      }
    }

    // 5. Nếu đơn có Review (đơn hoàn thành)
    if (ot.review) {
      await prisma.review.create({
        data: {
          orderId: order.id,
          serviceId: srv.id,
          userId: cust.id,
          authorName: cust.name,
          rating: ot.review.rating,
          comment: ot.review.comment,
          isDemo: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          orderId: order.id,
          entityType: 'ORDER',
          entityId: order.orderCode,
          action: 'CUSTOMER_REVIEWED',
          actorId: cust.id,
          actorRole: 'CUSTOMER',
          detailsJson: JSON.stringify({ rating: ot.review.rating }),
        },
      });
    }

    // 6. Thông báo mẫu
    await prisma.notification.create({
      data: {
        userId: cust.id,
        guestEmail: cust.email,
        type: ot.status === 'COMPLETED' ? 'ORDER_COMPLETED' : 'ORDER_RECEIVED',
        title: `Cập nhật đơn #${order.orderCode}: Trạng thái ${order.status}`,
        message: `Hồ sơ dịch vụ của bạn tại LUK Services hiện đang ở trạng thái ${order.status}.`,
        linkUrl: `/orders/${order.orderCode}`,
        isRead: ot.status === 'COMPLETED',
      },
    });
  }

  console.log(`✓ Đã tạo thành công ${orderTemplates.length} đơn hàng mẫu trải đều 10 trạng thái`);
  console.log('=== KHỞI TẠO DỮ LIỆU MẪU LUK SERVICES HOÀN TẤT 100% ===');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
