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

  // 4. Danh mục Dịch vụ sinh viên & Tài khoản AI Pro
  const servicesData = [
    // --- 0. TÀI KHOẢN AI PRO (CapCut, ChatGPT, Gemini, Canva, Claude) ---
    {
      title: 'Tài Khoản CapCut Pro Chính Chủ (1 Tháng / 1 Năm)',
      slug: 'tai-khoan-capcut-pro-chinh-chu',
      category: 'AI_ACCOUNTS',
      shortDescription: 'Xuất video 4K, mở khóa toàn bộ hiệu ứng VIP, Auto-caption AI không giới hạn.',
      description: 'Nâng cấp CapCut Pro trên chính email tài khoản của bạn hoặc cấp tài khoản riêng. Sử dụng mượt mà trên cả PC, Mac, iOS và Android. Bảo hành 1 đổi 1 trong suốt thời gian đăng ký.',
      startingPrice: 79000,
      turnaround: 'Giao ngay 5 phút',
      deliveryFormat: 'Kích hoạt email chính chủ',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'capcut pro, ai video, auto caption, edit video, tiktok',
      isDemo: true,
      sortOrder: 1,
    },
    {
      title: 'Tài Khoản ChatGPT Plus / Team (GPT-4o & Canvas)',
      slug: 'tai-khoan-chatgpt-plus-team',
      category: 'AI_ACCOUNTS',
      shortDescription: 'Mô hình GPT-4o không giới hạn tốc độ cao, tính năng Canvas viết luận & phân tích file PDF.',
      description: 'Hỗ trợ viết nghiên cứu khoa học, giải bài tập lập trình, phân tích dữ liệu chuyên sâu và vẽ ảnh DALL-E 3 chất lượng cao. Cấp tài khoản riêng tư hoặc nâng cấp gói chính chủ an toàn.',
      startingPrice: 189000,
      turnaround: 'Giao ngay 5 phút',
      deliveryFormat: 'Tài khoản OpenAI riêng tư',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'chatgpt plus, gpt-4o, openai, viết luận, lập trình',
      isDemo: true,
      sortOrder: 2,
    },
    {
      title: 'Tài Khoản Google Gemini Advanced + 2TB Google Cloud',
      slug: 'tai-khoan-gemini-advanced-2tb',
      category: 'AI_ACCOUNTS',
      shortDescription: 'Mô hình Gemini 1.5 Pro siêu trí tuệ, context 1 triệu tokens, kèm 2TB lưu trữ Drive.',
      description: 'Tích hợp sâu trực tiếp vào Google Docs, Gmail, Google Sheets. Đọc hiểu cả cuốn sách 1000 trang hoặc video 1 tiếng chỉ trong vài giây. Bảo hành đổi mới tức thì nếu có sự cố.',
      startingPrice: 149000,
      turnaround: 'Giao ngay 5 phút',
      deliveryFormat: 'Kích hoạt Google One chính chủ',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'gemini advanced, google ai, 2tb drive, nckh, context 1m',
      isDemo: true,
      sortOrder: 3,
    },
    {
      title: 'Tài Khoản Canva Pro Sinh Viên / Giáo Dục Trọn Đời',
      slug: 'tai-khoan-canva-pro-ban-quyen',
      category: 'AI_ACCOUNTS',
      shortDescription: 'Hơn 100+ triệu ảnh/video bản quyền, font tiếng Việt VIP, công cụ xóa nền Magic Studio.',
      description: 'Gia nhập nhóm Edu LUK Services bảo hành dài hạn. Sử dụng thoải mái tính năng Magic Resize, Text to Image, Brand Kit để làm slide, poster, CV mà không bị dính watermark.',
      startingPrice: 59000,
      turnaround: 'Giao ngay 5 phút',
      deliveryFormat: 'Kích hoạt trực tiếp vào email cá nhân',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'canva pro, thiết kế slide, poster, xóa nền, magic studio',
      isDemo: true,
      sortOrder: 4,
    },
    {
      title: 'Tài Khoản Claude Pro (Anthropic AI - Context 200K)',
      slug: 'tai-khoan-claude-pro-anthropic',
      category: 'AI_ACCOUNTS',
      shortDescription: 'Văn phong học thuật tự nhiên nhất, phân tích code Artifacts và tổng hợp tài liệu tiếng Anh.',
      description: 'Được đánh giá là AI hỗ trợ viết paper nghiên cứu khoa học và viết văn mượt mà nhất hiện nay. Khả năng tư duy logic và lập luận toán học vượt trội.',
      startingPrice: 199000,
      turnaround: 'Giao ngay 10 phút',
      deliveryFormat: 'Tài khoản cấp riêng',
      imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: false,
      tags: 'claude pro, anthropic, sonnet, artifacts, nckh',
      isDemo: true,
      sortOrder: 5,
    },

    // --- 0.5. EDIT TRANSCRIPT & PHỤ ĐỀ (Gỡ băng, Dịch SRT, Subtitle AI) ---
    {
      title: 'Gỡ Băng Phỏng Vấn Nghiên Cứu Định Tính (NCKH)',
      slug: 'go-bang-phong-van-nckh',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Chuyển hóa file ghi âm phỏng vấn sâu thành văn bản Word chuẩn xác 99.5%, gắn nhãn người nói.',
      description: 'Chuyên phục vụ sinh viên làm khóa luận tốt nghiệp và đề tài NCKH định tính. Đội ngũ nghe và chép từng câu chữ, loại bỏ từ thừa hoặc giữ nguyên văn phong ngữ nghĩa tùy yêu cầu nghiên cứu.',
      startingPrice: 100000,
      turnaround: '24 giờ',
      deliveryFormat: 'DOCX Word chuẩn phân tích định tính',
      imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'gỡ băng, transcript, phỏng vấn sâu, nckh, định tính',
      isDemo: true,
      sortOrder: 6,
    },
    {
      title: 'Dịch Phụ Đề & Đồng Bộ Timeline Song Ngữ Anh - Việt (SRT)',
      slug: 'dich-phu-de-song-ngu-srt',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Dịch thuật chính xác thuật ngữ chuyên ngành, khớp timeline từng mili-giây cho video bài giảng.',
      description: 'Nhận file video/audio từ YouTube, Zoom, tài liệu giảng đường nước ngoài. Xuất file phụ đề chuẩn SRT, VTT hoặc hardsub trực tiếp vào video với font chữ tiếng Việt hiện đại.',
      startingPrice: 150000,
      turnaround: '24 giờ',
      deliveryFormat: 'File SRT, VTT & MP4 hardsubbed',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'phụ đề song ngữ, dịch srt, timeline, video bài giảng',
      isDemo: true,
      sortOrder: 7,
    },
    {
      title: 'Biên Tập & Chuẩn Hóa Transcript Bài Giảng / Webinar',
      slug: 'bien-tap-chuan-hoa-transcript',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Biên tập bản gỡ băng thành tài liệu đọc mạch lạc, phân bổ đề mục Heading và tóm tắt ý chính.',
      description: 'Biến những buổi học online, hội thảo 2-3 tiếng thành tài liệu ôn tập gọn gàng 10-15 trang. Giúp tiết kiệm 80% thời gian nghe lại video bài giảng.',
      startingPrice: 120000,
      turnaround: '24 giờ',
      deliveryFormat: 'DOCX Word có mục lục + PDF',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'biên tập transcript, bài giảng, tóm tắt webinar, ôn thi',
      isDemo: true,
      sortOrder: 8,
    },
    {
      title: 'Tạo Phụ Đề Chữ Nổi Auto-Caption Chuẩn Style TikTok/Shorts',
      slug: 'tao-phu-de-noi-auto-caption',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Hiệu ứng phụ đề chữ nhảy từng từ (kinetic typography), highlight màu sắc bắt mắt.',
      description: 'Tối ưu cho các video đồ án truyền thông, video giới thiệu sự kiện CLB trên TikTok và Reels. Giữ chân người xem ngay cả khi tắt âm lượng.',
      startingPrice: 90000,
      turnaround: '12 giờ',
      deliveryFormat: 'Video MP4 9:16 export chất lượng cao',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'auto caption, tiktok, shorts, phụ đề chữ nhảy, reels',
      isDemo: true,
      sortOrder: 9,
    },
    {
      title: 'Gỡ Băng & Tổng Hợp Biên Bản Cuộc Họp CLB / Nhóm Đồ Án',
      slug: 'go-bang-bien-ban-hop-clb',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Trích xuất to-do list, deadline và quyết định quan trọng từ file ghi âm cuộc họp nhóm.',
      description: 'Không còn cảnh họp xong không ai nhớ việc cần làm. Bản tổng hợp ghi rõ: Ai làm gì, hạn chót ngày nào, các ý kiến tán thành và phản đối chính.',
      startingPrice: 80000,
      turnaround: '12 giờ',
      deliveryFormat: 'DOCX Action Items + Notion Template',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'biên bản họp, action items, đồ án nhóm, clb',
      isDemo: true,
      sortOrder: 10,
    },

    // --- 1. EDIT VIDEO (5 services) ---
    {
      title: 'Edit Video Recap & Sự Kiện CLB',
      slug: 'edit-video-recap-su-kien-clb',
      category: 'VIDEO_EDITING',
      shortDescription: 'Biên tập highlight reel, recap hoạt động CLB, teambuilding, chuẩn tỷ lệ 16:9 & 9:16.',
      description: 'Dành riêng cho ban truyền thông CLB, sự kiện sinh viên. Bao gồm: chọn lọc footage, dựng tiết tấu âm nhạc sôi động, chỉnh màu hiện đại, lồng sound effect và phụ đề highlight câu nói chính.',
      startingPrice: 350000,
      turnaround: '2-3 ngày',
      deliveryFormat: 'MP4 1080p/4K, Drive link',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'recap, video, clb, sự kiện, tiktok, reels',
      isDemo: true,
      sortOrder: 11,
    },
    {
      title: 'Edit Video Thuyết Trình & Bài Giảng',
      slug: 'edit-video-thuyet-trinh-bai-giang',
      category: 'VIDEO_EDITING',
      shortDescription: 'Cắt ghép bài nói, chèn slide đồng bộ, lọc tạp âm và tạo phụ đề song ngữ.',
      description: 'Phù hợp làm đồ án môn học, bài thuyết trình giữa kỳ hoặc video dự thi. Xử lý âm thanh trong trẻo, chèn slide mượt mà, tạo visual cues giúp người xem tập trung.',
      startingPrice: 250000,
      turnaround: '1-2 ngày',
      deliveryFormat: 'MP4 Full HD, Phụ đề SRT',
      imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'thuyết trình, bài giảng, đồ án, lọc âm',
      isDemo: true,
      sortOrder: 12,
    },
    {
      title: 'Dựng Video Giới Thiệu Bản Thân & CV Video',
      slug: 'dung-video-gioi-thieu-ban-than-cv',
      category: 'VIDEO_EDITING',
      shortDescription: 'Quay dựng portfolio cá nhân, video ứng tuyển học bổng & trao đổi quốc tế.',
      description: 'Biên tập video profile ấn tượng dành cho sinh viên ứng tuyển du học, thực tập sinh tập đoàn đa quốc gia. Lồng nhạc phong thái chuyên nghiệp, title motion giới thiệu thành tích nổi bật.',
      startingPrice: 300000,
      turnaround: '2 ngày',
      deliveryFormat: 'MP4 1080p + Thumbnail cover',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'cv video, profile, học bổng, du học',
      isDemo: true,
      sortOrder: 13,
    },
    {
      title: 'Chèn Phụ Đề Song Ngữ & Lọc Âm Chuyên Sâu',
      slug: 'chen-phu-de-song-ngu-loc-am',
      category: 'VIDEO_EDITING',
      shortDescription: 'Đồng bộ phụ đề tiếng Anh - Việt, lọc ồn microphone phòng học, cân bằng âm lượng.',
      description: 'Xử lý triệt để tiếng ồn gió, tiếng rè trong file ghi âm bài tập lớn. Dịch và can thiệp timeline từng mili-giây giúp phụ đề chuẩn khớp với ngữ điệu người nói.',
      startingPrice: 150000,
      turnaround: '24 giờ',
      deliveryFormat: 'File SRT & MP4 hardsubbed',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'phụ đề, song ngữ, lọc âm, podcast',
      isDemo: true,
      sortOrder: 14,
    },
    {
      title: 'Sản Xuất Video Motion Graphics Đồ Án',
      slug: 'san-xuat-video-motion-graphics-do-an',
      category: 'VIDEO_EDITING',
      shortDescription: 'Minh họa quy trình kỹ thuật, giải thích khái niệm trừu tượng bằng chuyển động 2D.',
      description: 'Giải pháp trực quan hóa cho đề tài kinh tế, công nghệ, y sinh học. Đồ họa vector mượt mà, voiceover thuyết minh truyền cảm hứng giúp bài bảo vệ đạt điểm tối đa.',
      startingPrice: 600000,
      turnaround: '3-5 ngày',
      deliveryFormat: 'MP4 4K, Project file After Effects',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: false,
      tags: 'motion graphics, đồ họa 2d, đồ án môn học',
      isDemo: true,
      sortOrder: 15,
    },

    // --- 2. THIẾT KẾ SLIDE (5 services) ---
    {
      title: 'Thiết Kế Slide Thuyết Trình Học Thuật',
      slug: 'thiet-ke-slide-thuyet-trinh-hoc-thuat',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Thiết kế slide chuyên đề, khóa luận, tone màu chuẩn đại học, sơ đồ hóa dữ liệu.',
      description: 'Chuyển hóa tài liệu text khô khan thành bài thuyết trình mạch lạc, khoa học. Thiết kế bố cục chuẩn tỷ lệ 16:9, bảng biểu, flow chart trực quan, hiệu ứng chuyển trang trang nhã.',
      startingPrice: 200000,
      turnaround: '1-2 ngày',
      deliveryFormat: 'PPTX, PDF, Google Slides',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'slide, powerpoint, học thuật, khóa luận',
      isDemo: true,
      sortOrder: 16,
    },
    {
      title: 'Thiết Kế Pitch Deck Cuộc Thi & Khởi Nghiệp',
      slug: 'thiet-ke-pitch-deck-cuoc-thi-khoi-nghiep',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Bộ slide gọi vốn & thuyết trình chung kết, mockup sản phẩm và biểu đồ tài chính.',
      description: 'Dành cho các đội thi Business Case, Hackathon, Khởi nghiệp sinh viên. Tối ưu cấu trúc câu chuyện (Problem - Solution - Market - Business Model - Ask), đồ họa cao cấp tạo ấn tượng ban giám khảo.',
      startingPrice: 450000,
      turnaround: '2-3 ngày',
      deliveryFormat: 'PPTX & Canva Pro editable',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'pitch deck, startup, business case, hackathon',
      isDemo: true,
      sortOrder: 17,
    },
    {
      title: 'Thiết Kế Slide Bảo Vệ Khóa Luận Tốt Nghiệp',
      slug: 'thiet-ke-slide-bao-ve-khoa-luan-tot-nghiep',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Định dạng slide trang trọng theo quy chuẩn hội đồng chấm luận văn tốt nghiệp.',
      description: 'Tối ưu độ tương phản máy chiếu giảng đường, bố trí sơ đồ mô hình nghiên cứu (Research Model), giả thuyết (Hypotheses) và bảng kết quả hồi quy rõ ràng, chuẩn phong thái học giả.',
      startingPrice: 350000,
      turnaround: '2 ngày',
      deliveryFormat: 'PPTX & PDF in ấn',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'khóa luận, tốt nghiệp, hội đồng, đại học',
      isDemo: true,
      sortOrder: 18,
    },
    {
      title: 'Thiết Kế Template PowerPoint Nhận Diện CLB',
      slug: 'thiet-ke-template-powerpoint-clb',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Bộ template trình chiếu đồng bộ màu sắc, typography và logo câu lạc bộ/dự án.',
      description: 'Xây dựng Master Slides với 25+ layout đa dạng (agenda, timeline, team member, KPI, so sánh). Ban điều hành chỉ cần nhập chữ là có ngay bài trình chiếu chuẩn visual identity.',
      startingPrice: 250000,
      turnaround: '2 ngày',
      deliveryFormat: 'POTX template & Google Slides theme',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'template, master slide, clb, branding',
      isDemo: true,
      sortOrder: 19,
    },
    {
      title: 'Sơ Đồ Hóa Dữ Liệu & Infographic Slide Báo Cáo',
      slug: 'so-do-hoa-du-lieu-infographic-slide',
      category: 'SLIDE_DESIGN',
      shortDescription: 'Chuyển hóa bảng tính Excel phức tạp thành visual infographic trực quan trong slide.',
      description: 'Vẽ lại biểu đồ dạng custom infographic, sơ đồ Venn, Gantt chart tiến độ dự án. Giúp khán giả nắm bắt ngay số liệu mấu chốt chỉ sau 3 giây quan sát màn chiếu.',
      startingPrice: 300000,
      turnaround: '1-2 ngày',
      deliveryFormat: 'Vector shapes trong PPTX',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'infographic, chart, data visual, excel',
      isDemo: true,
      sortOrder: 20,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✓ Đã tạo/cập nhật ${servicesData.length} dịch vụ trọng tâm trên 4 danh mục LUK Services`);

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
      serviceSlug: 'edit-video-recap-su-kien-clb',
      status: 'PENDING_REVIEW',
      notes: 'Video recap sự kiện chào tân sinh viên 2026, footage quay bằng Sony A7III khoảng 15GB.',
      deadlineDays: 5,
    },
    {
      code: 'LUK-2610-1002',
      customerIdx: 1,
      serviceSlug: 'thiet-ke-slide-thuyet-trinh-hoc-thuat',
      status: 'PENDING_REVIEW',
      notes: 'Cần dàn trang bài thuyết trình môn Quản trị chiến lược, nhóm có 4 thành viên.',
      deadlineDays: 4,
    },

    // 2. IN_REVIEW (2 orders)
    {
      code: 'LUK-2610-2001',
      customerIdx: 2,
      serviceSlug: 'go-bang-phong-van-nckh',
      status: 'IN_REVIEW',
      notes: 'Gỡ băng phỏng vấn 5 chuyên gia ngành Logistics cho đề tài nghiên cứu khoa học, tổng thời lượng 120 phút.',
      deadlineDays: 3,
    },
    {
      code: 'LUK-2610-2002',
      customerIdx: 3,
      serviceSlug: 'thiet-ke-pitch-deck-cuoc-thi-khoi-nghiep',
      status: 'IN_REVIEW',
      notes: 'Đội thi lọt vào bán kết cuộc thi Ý tưởng sáng tạo sinh viên, cần tút lại 18 trang slide.',
      deadlineDays: 4,
    },

    // 3. QUOTED (2 orders)
    {
      code: 'LUK-2610-3001',
      customerIdx: 4,
      serviceSlug: 'tai-khoan-capcut-pro-chinh-chu',
      status: 'QUOTED',
      quotedPrice: 99000,
      depositRequired: 99000,
      notes: 'Nâng cấp CapCut Pro 1 tháng chính chủ bằng email cá nhân để dựng bài tập lớn.',
      deadlineDays: 1,
      quoteNotes: 'Báo giá kích hoạt CapCut Pro 1 tháng 99.000₫, giao tài khoản sau 5 phút chuyển khoản.',
    },
    {
      code: 'LUK-2610-3002',
      customerIdx: 5,
      serviceSlug: 'dich-phu-de-song-ngu-srt',
      status: 'QUOTED',
      quotedPrice: 180000,
      depositRequired: 90000,
      notes: 'Dịch và tạo file SRT song ngữ Anh - Việt cho video phỏng vấn dài 15 phút.',
      deadlineDays: 2,
      quoteNotes: 'Báo giá 180.000₫ gồm file SRT tiếng Anh, tiếng Việt và MP4 hardsub.',
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
