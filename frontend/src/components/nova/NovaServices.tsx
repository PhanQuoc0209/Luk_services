'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Check, Sparkles, BookOpen, Video, Presentation, PenTool, GraduationCap, Globe, Briefcase } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { NovaServiceModal, ServiceDetailData } from './NovaServiceModal';

export const NOVA_SERVICES_DATA: ServiceDetailData[] = [
  {
    id: 'nova-srv-01',
    group: 'CREATE',
    code: '01',
    name: 'Video Editing',
    quote: 'Biến những thước phim và ý tưởng rời rạc thành video có câu chuyện, nhịp điệu và dấu ấn riêng.',
    description:
      'Đội ngũ dựng phim NOVA giúp bạn xử lý mọi định dạng video: từ video đồ án môn học, recap sự kiện CLB sôi động cho đến video cá nhân ứng tuyển học bổng. Âm thanh trong trẻo, nhịp dựng hiện đại, chỉnh màu tinh tế và đồ họa chuyển động chỉn chu.',
    deliverables: [
      'Chỉnh sửa video',
      'Dựng video thuyết trình và dự án',
      'Video truyền thông và nội dung mạng xã hội',
    ],
    turnaround: '1 — 3 ngày',
    suggestedPrice: 350000,
    slug: 'edit-video-recap-su-kien-clb',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'VIDEO_EDITING',
  },
  {
    id: 'nova-srv-02',
    group: 'CREATE',
    code: '02',
    name: 'Presentation & Design',
    quote: 'Truyền tải ý tưởng rõ ràng và tạo ấn tượng bằng những thiết kế trực quan chuyên nghiệp.',
    description:
      'Biến bài thuyết trình giữa kỳ hay lễ bảo vệ khóa luận thành một trải nghiệm thị giác thuyết phục. Cấu trúc thông điệp mạch lạc, bố cục phân cấp trực quan và chuẩn nhận diện học thuật hoặc phong cách hiện đại theo yêu cầu.',
    deliverables: [
      'Thiết kế slide thuyết trình',
      'Infographic và tài liệu trực quan',
      'Poster và ấn phẩm truyền thông',
    ],
    turnaround: '24 — 48 giờ',
    suggestedPrice: 280000,
    slug: 'thiet-ke-slide-khoa-luan-tot-nghiep',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'SLIDE_DESIGN',
  },
  {
    id: 'nova-srv-03',
    group: 'CREATE',
    code: '03',
    name: 'Script & Content Writing',
    quote: 'Phát triển ý tưởng thành nội dung có cấu trúc, thông điệp rõ ràng và cách truyền tải hấp dẫn.',
    description:
      'Từ ý tưởng sơ khai thành kịch bản video chặt chẽ, bài viết truyền thông lôi cuốn hoặc tài liệu học thuật có chiều sâu. Ngôn từ gãy gọn, văn phong phù hợp với đối tượng độc giả và giàu sức thuyết phục.',
    deliverables: [
      'Kịch bản video',
      'Nội dung truyền thông',
      'Biên tập và phát triển nội dung',
    ],
    turnaround: '24 — 36 giờ',
    suggestedPrice: 200000,
    slug: 'bien-tap-chuan-hoa-transcript',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'TRANSCRIPT_EDITING',
  },
  {
    id: 'nova-srv-04',
    group: 'LEARN',
    code: '04',
    name: 'Tutoring & Learning',
    quote: 'Đồng hành cùng bạn hiểu sâu kiến thức, luyện tập và cải thiện phương pháp học tập.',
    description:
      'Gặp gỡ cố vấn học thuật 1-kèm-1 để tháo gỡ những phần kiến thức khó, rèn luyện tư duy tự học và tối ưu phương pháp ôn thi. Không học vẹt, chú trọng hiểu bản chất và tự tin làm bài thi.',
    deliverables: [
      'Hỗ trợ giải thích kiến thức',
      'Hướng dẫn luyện tập',
      'Ôn tập và củng cố kiến thức',
    ],
    turnaround: 'Linh hoạt theo lịch hẹn',
    suggestedPrice: 180000,
    slug: 'tutoring-learning-academic',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'ACADEMIC_RESEARCH',
  },
  {
    id: 'nova-srv-05',
    group: 'LEARN',
    code: '05',
    name: 'English Support',
    quote: 'Phát triển khả năng sử dụng tiếng Anh thông qua việc luyện tập và hỗ trợ phù hợp với trình độ.',
    description:
      'Môi trường luyện tập tiếng Anh thực chiến không phán xét. Hỗ trợ chuẩn bị bài thuyết trình tiếng Anh, chỉnh sửa cấu trúc ngữ pháp bài luận chuyên ngành và luyện phản xạ giao tiếp tự nhiên.',
    deliverables: [
      'Luyện nghe và nói',
      'Hỗ trợ ngữ pháp và từ vựng',
      'Luyện tập giao tiếp và học thuật',
    ],
    turnaround: 'Linh hoạt theo lịch hẹn',
    suggestedPrice: 220000,
    slug: 'english-support-coaching',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'ACADEMIC_RESEARCH',
  },
  {
    id: 'nova-srv-06',
    group: 'GROW',
    code: '06',
    name: 'CV & Portfolio',
    quote: 'Xây dựng hình ảnh cá nhân chuyên nghiệp, giúp bạn thể hiện năng lực và câu chuyện của mình.',
    description:
      'Chuyển hóa kinh nghiệm hoạt động và dự án đại học thành hồ sơ năng lực tiêu chuẩn quốc tế. Cấu trúc chuẩn ATS, phong cách thiết kế tinh tế và tư vấn nêu bật giá trị cốt lõi để chinh phục nhà tuyển dụng.',
    deliverables: [
      'Thiết kế CV',
      'Xây dựng Portfolio',
      'Tối ưu cách trình bày kinh nghiệm và dự án',
    ],
    turnaround: '2 — 3 ngày',
    suggestedPrice: 320000,
    slug: 'dung-video-gioi-thieu-ban-than-cv',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    categoryKey: 'VIDEO_EDITING',
  },
];

export function NovaServices() {
  const [selectedService, setSelectedService] = useState<ServiceDetailData | null>(null);
  const [activeCreateIdx, setActiveCreateIdx] = useState(0);

  const createServices = NOVA_SERVICES_DATA.filter((s) => s.group === 'CREATE');
  const learnServices = NOVA_SERVICES_DATA.filter((s) => s.group === 'LEARN');
  const growService = NOVA_SERVICES_DATA.find((s) => s.group === 'GROW')!;

  const activeCreateItem = createServices[activeCreateIdx];

  return (
    <>
      <section
        id="services"
        aria-label="Các dịch vụ của NOVA"
        className="relative bg-white text-nova-navy py-28 sm:py-36 overflow-hidden border-t border-slate-100"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Main Section Header */}
          <div className="max-w-3xl mb-20 sm:mb-28">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-nova-champagne" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-slate">
                  Our Services
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-[54px] font-heading font-extrabold text-nova-navy tracking-tight leading-[1.14] mb-6">
                Bạn cần tiến xa hơn?{' '}
                <span className="font-serif italic font-normal text-nova-blue block sm:inline">
                  NOVA sẵn sàng đồng hành.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-nova-slate leading-relaxed font-body">
                Từ những ý tưởng sáng tạo đến hành trình học tập và phát triển nghề nghiệp, mọi sự hỗ
                trợ bạn cần đều bắt đầu tại đây.
              </p>
            </ScrollReveal>
          </div>

          {/* ========================================================
              GROUP 01 — CREATE (Editorial Asymmetric Showcase)
             ======================================================== */}
          <div className="mb-28 sm:mb-36">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-navy text-white text-[10px] font-bold tracking-widest uppercase mb-2">
                    GROUP 01 · CREATE
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy">
                    Bring your ideas to life.
                  </h3>
                </div>
                <p className="max-w-md text-sm text-nova-slate leading-relaxed">
                  Biến ý tưởng thành những sản phẩm sáng tạo chỉn chu, có dấu ấn riêng và sẵn sàng để
                  bạn tự tin thể hiện.
                </p>
              </div>
            </ScrollReveal>

            {/* Asymmetric Interactive Layout for CREATE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Column: Interactive 3-Service Selector */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                {createServices.map((service, index) => {
                  const isActive = activeCreateIdx === index;
                  return (
                    <ScrollReveal key={service.code} delay={index * 100}>
                      <div
                        onClick={() => setActiveCreateIdx(index)}
                        className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 ${
                          isActive
                            ? 'bg-nova-ivory border-nova-blue/40 shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-serif italic text-lg text-nova-champagne">
                              {service.code}
                            </span>
                            <h4 className="text-lg sm:text-xl font-heading font-bold text-nova-navy">
                              {service.name}
                            </h4>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                              isActive
                                ? 'bg-nova-blue text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {service.turnaround}
                          </span>
                        </div>

                        <p className="font-serif italic text-sm text-nova-blue/90 mb-3">
                          “{service.quote}”
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {service.deliverables.map((d, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200/80 text-slate-700"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedService(service);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-nova-navy hover:text-nova-blue tracking-wide uppercase group/btn"
                          >
                            <span>Khám phá dịch vụ</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* Right Column: Large Dynamic Visual Preview */}
              <div className="lg:col-span-6 min-h-[380px] lg:min-h-full">
                <ScrollReveal delay={200} className="h-full">
                  <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                    <img
                      src={activeCreateItem.imageUrl}
                      alt={activeCreateItem.name}
                      key={activeCreateItem.imageUrl}
                      className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.88] transition-all duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nova-navy/90 via-nova-navy/30 to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                      <div className="flex items-center gap-2 text-nova-champagne text-xs font-mono">
                        <span>PREVIEW</span>
                        <span>·</span>
                        <span>{activeCreateItem.name.toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-slate-200 max-w-md font-body leading-relaxed line-clamp-2">
                        {activeCreateItem.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedService(activeCreateItem)}
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-nova-navy text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-200"
                      >
                        <span>Chi tiết gói {activeCreateItem.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* ========================================================
              GROUP 02 — LEARN (Warm, Accessible 2-Column Duo)
             ======================================================== */}
          <div className="mb-28 sm:mb-36">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-navy text-white text-[10px] font-bold tracking-widest uppercase mb-2">
                    GROUP 02 · LEARN
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy">
                    Learn with confidence.
                  </h3>
                </div>
                <p className="max-w-md text-sm text-nova-slate leading-relaxed">
                  Học tập chủ động hơn với sự hướng dẫn phù hợp, giúp bạn hiểu kiến thức và tự tin
                  phát triển kỹ năng.
                </p>
              </div>
            </ScrollReveal>

            {/* 2-Column Duo Layout with Natural Study Imagery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {learnServices.map((service, idx) => (
                <ScrollReveal key={service.code} delay={idx * 150}>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col justify-between group hover:border-nova-blue/40 transition-all duration-300">
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover object-center filter grayscale-[10%] group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full nova-glass text-white text-[11px] font-mono tracking-wider">
                        {service.code}
                      </div>
                    </div>

                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl sm:text-2xl font-heading font-bold text-nova-navy">
                            {service.name}
                          </h4>
                          <span className="text-xs text-nova-slate font-medium">
                            {service.turnaround}
                          </span>
                        </div>

                        <p className="font-serif italic text-base text-nova-blue">
                          “{service.quote}”
                        </p>

                        <p className="text-sm text-nova-slate leading-relaxed">
                          {service.description}
                        </p>

                        <div className="pt-2 space-y-2 border-t border-slate-100">
                          {service.deliverables.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-nova-champagne" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-nova-slate">Đội ngũ kèm trực tiếp</span>
                        <button
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-nova-navy hover:text-nova-blue uppercase tracking-wide group/btn"
                        >
                          <span>Khám phá dịch vụ</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ========================================================
              GROUP 03 — GROW (Deep Editorial Wide Showcase)
             ======================================================== */}
          <div>
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-navy text-white text-[10px] font-bold tracking-widest uppercase mb-2">
                    GROUP 03 · GROW
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy">
                    Build your future.
                  </h3>
                </div>
                <p className="max-w-md text-sm text-nova-slate leading-relaxed">
                  Chuẩn bị hành trang nghề nghiệp và thể hiện giá trị bản thân qua những sản phẩm
                  chuyên nghiệp.
                </p>
              </div>
            </ScrollReveal>

            {/* Deep Editorial Wide Layout for CV & Portfolio */}
            <ScrollReveal delay={150}>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-nova-navy text-white shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Left info column */}
                  <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-serif italic text-xl text-nova-champagne">
                          {growService.code}
                        </span>
                        <h4 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight">
                          {growService.name}
                        </h4>
                      </div>

                      <p className="font-serif italic text-lg sm:text-xl text-nova-champagne/90 leading-snug">
                        “{growService.quote}”
                      </p>

                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                        {growService.description}
                      </p>
                    </div>

                    {/* Deliverables tags */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                        Các hạng mục tiêu chuẩn:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {growService.deliverables.map((item, i) => (
                          <span
                            key={i}
                            className="px-3.5 py-1.5 rounded-lg nova-glass text-xs text-white border border-white/10"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                      <div className="text-xs text-slate-400">
                        Thời gian hoàn thiện: <strong className="text-white">{growService.turnaround}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedService(growService)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nova-champagne text-nova-navy font-semibold text-xs tracking-wider uppercase shadow hover:bg-white transition-all duration-200 active:scale-95 group/btn"
                      >
                        <span>Khám phá dịch vụ</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Right visual column */}
                  <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-900">
                    <img
                      src={growService.imageUrl}
                      alt={growService.name}
                      className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.1] hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-nova-navy via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Service Details & Booking Modal */}
      <NovaServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
