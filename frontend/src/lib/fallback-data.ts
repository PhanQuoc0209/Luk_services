// Auto-generated fallback data for high-availability & zero-downtime on Vercel
export interface FallbackService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  startingPrice: number;
  turnaround: string;
  deliveryFormat: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  tags?: string | null;
  options?: string | null;
  isDemo: boolean;
  sortOrder: number;
  reviews?: any[];
}

export interface FallbackDebateResource {
  id: string;
  title: string;
  topic: string;
  description: string;
  format: string;
  fileSize: string;
  difficulty: string;
  language: string;
  tags: string;
  downloadCount: number;
  downloadUrl: string;
}

const rawServices: any[] = [
    // --- 0.5. VIẾT KỊCH BẢN (TRANSCRIPT) & GỠ BĂNG ---
    {
      title: 'Viết Kịch Bản Video Thuyết Trình & Đồ Án Nhóm',
      slug: 'viet-kich-ban-thuyet-trinh',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Xây dựng khung kịch bản thuyết trình, phân vai lời thoại từng thành viên, tối ưu thời lượng 10-15 phút.',
      description: 'Dành cho nhóm sinh viên cần kịch bản bài thuyết trình môn học, đồ án tốt nghiệp chuẩn chỉnh, lôi cuốn người nghe và dễ nhớ lời.',
      startingPrice: 120000,
      turnaround: '24 giờ',
      deliveryFormat: 'DOCX Word có phân vai & timeline + PDF',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'viết kịch bản, kịch bản thuyết trình, đồ án nhóm, fptu',
      isDemo: true,
      sortOrder: 6,
    },
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
      sortOrder: 7,
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
      isPopular: false,
      tags: 'phụ đề song ngữ, dịch srt, timeline, video bài giảng',
      isDemo: true,
      sortOrder: 8,
    },
    {
      title: 'Biên Soạn Kịch Bản & Luận Điểm Tranh Biện (Debate Script)',
      slug: 'bien-soan-kich-ban-debate',
      category: 'TRANSCRIPT_EDITING',
      shortDescription: 'Lên khung kịch bản tranh biện, hệ thống luận điểm ủng hộ/phản đối (Gov/Opp) chuẩn format British Parliamentary.',
      description: 'Hỗ trợ sinh viên tham gia giải đấu tranh biện hoặc bài tập môn kỹ năng nói. Cấu trúc luận điểm PEEL/ARES chặt chẽ, luận chứng thuyết phục.',
      startingPrice: 150000,
      turnaround: '24 giờ',
      deliveryFormat: 'DOCX Word kịch bản tranh biện + Ghi chú phản biện',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'kịch bản tranh biện, debate bp, luận điểm, speaking',
      isDemo: true,
      sortOrder: 9,
    },

    // --- 1. EDIT VIDEO (4 dịch vụ theo yêu cầu) ---
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
      sortOrder: 11,
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
      sortOrder: 12,
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
      sortOrder: 13,
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
      sortOrder: 14,
    },

    // --- 2. EDIT SLIDE (2 dịch vụ theo yêu cầu) ---
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
      sortOrder: 16,
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
      sortOrder: 17,
    },

    // --- 4. HỖ TRỢ MÔN HỌC & ĐỒ ÁN ĐẠI HỌC (KINH TẾ, CNTT, LUẬT, TRUYỀN THÔNG) ---
    {
      title: 'Hỗ Trợ Chạy Mô Hình Kinh Tế Lượng & SPSS (OLS, SEM, SmartPLS)',
      slug: 'ho-tro-kinh-te-luong-spss-smartpls',
      category: 'ECONOMICS',
      shortDescription: 'Làm sạch dữ liệu, kiểm định Cronbach Alpha, EFA, hồi quy OLS và giải thích ý nghĩa kinh tế.',
      description: 'Đội ngũ cử nhân kinh tế hỗ trợ sinh viên các trường NEU, FTU, UEH, VNU xử lý số liệu khảo sát, khắc phục hiện tượng đa cộng tuyến, phương sai thay đổi và tự tương quan. Hướng dẫn đọc bảng kết quả chuẩn APA.',
      startingPrice: 350000,
      turnaround: '24-48 giờ',
      deliveryFormat: 'File dữ liệu .sav, file syntax & file Word giải thích chi tiết',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'kinh tế lượng, spss, smartpls, nckh, dữ liệu, luận văn',
      isDemo: true,
      sortOrder: 21,
    },
    {
      title: 'Phân Tích Báo Cáo Tài Chính & Mô Hình Định Giá Doanh Nghiệp (DCF, WACC)',
      slug: 'phan-tich-bao-cao-tai-chinh-dinh-gia',
      category: 'ECONOMICS',
      shortDescription: 'Tính toán chỉ số tài chính (ROE, ROA, WACC, DCF), mô hình dự phóng dòng tiền môn Tài chính doanh nghiệp.',
      description: 'Hỗ trợ sinh viên ngành Tài chính - Ngân hàng, Kế toán - Kiểm toán bóc tách báo cáo tài chính kiểm toán của công ty niêm yết trên HOSE/HNX. Trực quan hóa biểu đồ tăng trưởng và rủi ro thanh khoản.',
      startingPrice: 300000,
      turnaround: '1-2 ngày',
      deliveryFormat: 'Mô hình Excel tính toán động + Slide tóm tắt',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'tài chính doanh nghiệp, báo cáo tài chính, dcf, wacc, excel',
      isDemo: true,
      sortOrder: 22,
    },
    {
      title: 'Kèm Đồ Án Lập Trình Web / App & Review Source Code (React, Next.js, Node.js)',
      slug: 'kem-do-an-lap-trinh-web-app',
      category: 'COMPUTER_SCIENCE',
      shortDescription: 'Hỗ trợ xây dựng kiến trúc full-stack, tích hợp database, sửa bug lỗi build và hướng dẫn bảo vệ.',
      description: 'Dành cho sinh viên CNTT, Kỹ thuật phần mềm (FPT, HUST, UIT, VNU...). Hỗ trợ giải thích chi tiết logic từng component, API endpoint, cách deploy lên Vercel/Render và chuẩn bị bộ câu hỏi phản biện của hội đồng.',
      startingPrice: 450000,
      turnaround: '2-4 ngày',
      deliveryFormat: 'Repository GitHub clean code + Video quay giải thích mã nguồn',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'cntt, lập trình, full-stack, nextjs, react, nodejs, fix bug',
      isDemo: true,
      sortOrder: 23,
    },
    {
      title: 'Hỗ Trợ Bài Tập Lớn Python & Thuật Toán Cơ Bản (Numpy, Pandas, OOP)',
      slug: 'ho-tro-bai-tap-lon-python-thuat-toan',
      category: 'COMPUTER_SCIENCE',
      shortDescription: 'Xử lý bài tập lớn Nhập môn lập trình, Cấu trúc dữ liệu & giải thuật, xử lý file dữ liệu tự động.',
      description: 'Viết code rõ ràng, comment từng dòng, chuẩn PEP 8. Hướng dẫn sinh viên tự chạy trên máy, giải thích độ phức tạp thuật toán O(n) và cách thức debug lỗi cú pháp.',
      startingPrice: 200000,
      turnaround: '12-24 giờ',
      deliveryFormat: 'Notebook .ipynb & file mã nguồn .py chú thích tỉ mỉ',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: false,
      tags: 'python, pandas, thuật toán, ctdl, bài tập lớn, oop',
      isDemo: true,
      sortOrder: 24,
    },
    {
      title: 'Hỗ Trợ Tiểu Luận Pháp Luật Đại Cương & Case Study Luật Thương Mại',
      slug: 'ho-tro-tieu-luan-phap-luat-case-study',
      category: 'LAW_SOCIAL',
      shortDescription: 'Tra cứu văn bản quy phạm pháp luật, bình luận án thực tế, trích dẫn quy chuẩn và format chuẩn bộ môn.',
      description: 'Hỗ trợ định hướng lập luận, trích dẫn Điều/Khoản luật hiện hành, đối chiếu thực tiễn giải quyết tranh chấp hợp đồng thương mại, lao động hoặc sở hữu trí tuệ.',
      startingPrice: 250000,
      turnaround: '2-3 ngày',
      deliveryFormat: 'DOCX Word chuẩn format bài nộp giảng viên',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'luật đại cương, case study, tiểu luận, tranh biện, nckh',
      isDemo: true,
      sortOrder: 25,
    },
    {
      title: 'Hiệu Đính Trích Dẫn Chuẩn APA 7th / Harvard & Check Trùng Lặp Turnitin',
      slug: 'hieu-dinh-trich-dan-apa-harvard-turnitin',
      category: 'LAW_SOCIAL',
      shortDescription: 'Chuẩn hóa 100% danh mục tài liệu tham khảo theo quy chuẩn quốc tế, rà soát tỷ lệ trùng lặp.',
      description: 'Giúp sinh viên yên tâm trước khi nộp bài khóa luận hoặc bài tập lớn. Xử lý in-text citation, định dạng bảng biểu, thụt dòng hanging indent theo chuẩn APA 7th ấn bản mới nhất.',
      startingPrice: 150000,
      turnaround: '6-12 giờ',
      deliveryFormat: 'File DOCX đã hiệu đính & Báo cáo đối soát trích dẫn',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'apa 7, harvard, trích dẫn, turnitin, khóa luận, nckh',
      isDemo: true,
      sortOrder: 26,
    },
    {
      title: 'Thiết Kế Ấn Phẩm Truyền Thông Sự Kiện CLB & Hội Thảo Học Thuật',
      slug: 'thiet-ke-an-pham-truyen-thong-clb',
      category: 'MEDIA_DESIGN',
      shortDescription: 'Trọn bộ Avatar, Cover Facebook, Standee, Poster A3 và thẻ ban tổ chức sự kiện sinh viên.',
      description: 'Ý tưởng hiện đại, màu sắc bắt mắt theo visual trend mới nhất. File xuất chất lượng cao phục vụ cả đăng mạng xã hội và in ấn tại xưởng không bị vỡ hạt.',
      startingPrice: 250000,
      turnaround: '24-48 giờ',
      deliveryFormat: 'File thiết kế gốc PSD/AI/Canva + PNG/PDF sắc nét',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPopular: true,
      tags: 'poster, standee, truyền thông, clb, sự kiện, canva',
      isDemo: true,
      sortOrder: 27,
    },
    {
      title: 'Trọn Bộ Giáo Trình & Motion Book Tranh Biện Nghị Viện Anh (BP)',
      slug: 'giao-trinh-motion-book-tranh-bien-bp',
      category: 'DEBATE_RESOURCES',
      shortDescription: '200+ đề thi tuyển chọn, dàn ý phân tích 7 phút cho 8 vị trí trong phòng thi BP chuẩn WUDC.',
      description: 'Cẩm nang toàn diện dành cho debater từ nhập môn đến thi đấu quốc tế. Hướng dẫn xây dựng Matter, Manner, Method, cách đặt POI sắc bén và bẻ gãy case đối phương.',
      startingPrice: 120000,
      turnaround: 'Tải ngay lập tức',
      deliveryFormat: 'PDF Ebook tương tác + Notion Database tra cứu',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isPopular: true,
      tags: 'debate bp, tranh biện, wudc, motion book, tài liệu',
      isDemo: true,
      sortOrder: 28,
    },
  ];

export const FALLBACK_SERVICES: FallbackService[] = rawServices.map((s, idx) => ({
  id: 'fallback_svc_' + (idx + 1),
  ...s,
  isActive: true,
  reviews: [],
}));

const rawDebateResources: any[] = [
  {
    title: 'Giáo Trình Tranh Biện Nghị Viện Anh British Parliamentary (BP) Toàn Diện',
    topic: 'Kỹ Năng Tranh Biện & Tư Duy Phản Biện',
    description: 'Chi tiết vai trò 4 đội (OG, OO, CG, CO) và 8 vị trí diễn giả. Hướng dẫn dựng case, phân tầng luận điểm và phản biện theo luật WUDC quốc tế.',
    format: 'PDF Ebook (120 trang)',
    fileSize: '14.8 MB',
    difficulty: 'Cơ bản đến Nâng cao',
    language: 'Tiếng Việt & Thuật ngữ tiếng Anh',
    tags: 'debate bp, wudc, giáo trình, tư duy phản biện',
  },
  {
    title: 'Tuyển Tập 200+ Đề Tranh Biện Chọn Lọc (Motion Book) Phân Tích Chuyên Sâu',
    topic: 'Kinh Tế, Xã Hội & Đạo Đức Công Nghệ AI',
    description: 'Tổng hợp các kiến nghị tiêu biểu giải VUDC, VMDC, WUDC kèm gợi ý bối cảnh (context), định nghĩa (definition) và luận điểm 2 phe Ủng hộ - Phản đối.',
    format: 'PDF & Notion Link',
    fileSize: '8.5 MB',
    difficulty: 'Trung cấp',
    language: 'Song ngữ Anh - Việt',
    tags: 'motion book, đề thi, case study, kinh tế, ai ethics',
  },
  {
    title: 'Cẩm Nang Dành Cho Diễn Giả Thành Viên & Tổng Kết (Member & Whip Speaker)',
    topic: 'Chiến Thuật Mở Rộng & So Sánh Luận Điểm',
    description: 'Cách tìm kiếm Extension độc đáo không trùng đội mở đầu, kỹ thuật cân đo tác động (weighing metrics) và cấu trúc bài nói Whip 7 phút thuyết phục ban giám khảo.',
    format: 'PDF Slide Guide',
    fileSize: '6.2 MB',
    difficulty: 'Nâng cao',
    language: 'Tiếng Việt',
    tags: 'whip, extension, weighing, wudc, vudc',
  },
  {
    title: 'Mẫu Đề Cương Nghiên Cứu Khoa Học Đại Học (Định Tính & Định Lượng)',
    topic: 'Nghiên Cứu Khoa Học & Phương Pháp Luận',
    description: 'Bộ khung chuẩn Bộ GD&ĐT gồm: Lý do chọn đề tài, Tổng quan tài liệu, Mô hình nghiên cứu, Phương pháp thu thập dữ liệu và Kế hoạch tiến độ.',
    format: 'DOCX Word Editable',
    fileSize: '3.1 MB',
    difficulty: 'Tất cả sinh viên',
    language: 'Tiếng Việt chuẩn học thuật',
    tags: 'nckh, đề cương, phương pháp nghiên cứu, luận văn',
  },
  {
    title: 'Sổ Tay Hiệu Đính Trích Dẫn & Thư Mục Tài Liệu Tham Khảo APA 7th',
    topic: 'Quy Chuẩn Học Thuật Quốc Tế',
    description: 'Quy tắc trích dẫn chuẩn cho sách, bài báo tạp chí scopus, bài báo mạng, báo cáo tài chính và video phỏng vấn. Kèm bảng tra cứu nhanh lỗi thường gặp.',
    format: 'PDF Visual Guide',
    fileSize: '4.5 MB',
    difficulty: 'Cơ bản',
    language: 'Tiếng Việt',
    tags: 'apa 7, trích dẫn, tham khảo, thư mục, đạo văn',
  },
];

export const FALLBACK_DEBATE_RESOURCES: FallbackDebateResource[] = rawDebateResources.map((d, idx) => ({
  id: 'fallback_deb_' + (idx + 1),
  ...d,
  downloadCount: 42 + idx * 7,
  downloadUrl: '#',
}));

export function getFallbackServices(category?: string): FallbackService[] {
  if (!category || category === 'ALL') {
    return FALLBACK_SERVICES;
  }
  return FALLBACK_SERVICES.filter((s) => s.category === category);
}

export function getFallbackServiceBySlug(slug: string): FallbackService | undefined {
  return FALLBACK_SERVICES.find((s) => s.slug === slug);
}
