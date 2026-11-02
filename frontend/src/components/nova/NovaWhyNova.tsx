'use client';

import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export function NovaWhyNova() {
  const values = [
    {
      index: '01',
      title: 'All in One Place',
      description:
        'Mọi hỗ trợ cần thiết cho hành trình sinh viên, từ sáng tạo đến học tập và nghề nghiệp.',
      details:
        'Không cần chuyển đổi qua lại giữa nhiều bên riêng lẻ. Từ slide thuyết trình, video đồ án đến ôn thi và hoàn thiện CV — toàn bộ tích hợp trong một hệ sinh thái liền mạch.',
    },
    {
      index: '02',
      title: 'One Dedicated Team',
      description:
        'Làm việc trực tiếp với đội ngũ NOVA, không phải tìm kiếm và lựa chọn giữa nhiều freelancer.',
      details:
        'Cam kết chất lượng đồng đều, bảo mật thông tin học thuật tuyệt đối và quy trình tiếp nhận trực tiếp từ đội ngũ chuyên môn nội bộ.',
    },
    {
      index: '03',
      title: 'Built Around Students',
      description:
        'Giải pháp được xây dựng dựa trên nhu cầu, lịch trình và ngân sách của sinh viên.',
      details:
        'Linh hoạt theo mùa thi cử, thấu hiểu áp lực deadline dồn dập và mức chi phí tối ưu để mọi sinh viên đều có cơ hội tiếp cận tiêu chuẩn cao cấp.',
    },
    {
      index: '04',
      title: 'Quality with Purpose',
      description:
        'Mỗi giải pháp đều hướng đến chất lượng và giá trị thực tế cho sự phát triển của bạn.',
      details:
        'Chúng tôi không chỉ giúp bạn nộp bài đúng hạn — chúng tôi cùng bạn tạo nên những sản phẩm tự hào, mở ra cánh cửa cho học bổng và cơ hội nghề nghiệp tương lai.',
    },
  ];

  return (
    <section
      id="why-nova"
      aria-label="Tại sao chọn NOVA"
      className="relative bg-white text-nova-navy py-28 sm:py-36 overflow-hidden border-t border-slate-100"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Philosophy (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[1px] bg-nova-champagne" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-slate">
                  Why NOVA
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-nova-navy tracking-tight leading-[1.15]">
                Không chỉ là một dịch vụ.{' '}
                <span className="font-serif italic font-normal text-nova-blue block mt-1">
                  Là người đồng hành trên hành trình của bạn.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-nova-slate leading-relaxed font-body pt-2">
                Từ ý tưởng đầu tiên đến bước tiến tiếp theo, NOVA kết nối hỗ trợ sáng tạo, học tập và
                phát triển nghề nghiệp trong một trải nghiệm thống nhất.
              </p>

              {/* Tagline highlight */}
              <div className="pt-6 border-t border-slate-100">
                <span className="font-serif italic text-2xl text-nova-champagne block">
                  “Make more possible.”
                </span>
                <span className="text-xs text-nova-slate uppercase tracking-wider block mt-1">
                  Tôn chỉ đồng hành cùng sinh viên
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 4 Core Values with Editorial Rhythm */}
          <div className="lg:col-span-7 divide-y divide-slate-200/80">
            {values.map((item, index) => (
              <ScrollReveal key={item.index} delay={index * 120} className="py-8 sm:py-10 first:pt-0 last:pb-0">
                <div className="space-y-3 group">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-nova-navy group-hover:text-nova-blue transition-colors">
                      {item.title}
                    </h3>
                    <span className="font-serif italic text-xl text-nova-champagne font-normal shrink-0">
                      {item.index}
                    </span>
                  </div>

                  <p className="text-base font-serif italic text-slate-800 leading-snug">
                    “{item.description}”
                  </p>

                  <p className="text-sm text-nova-slate leading-relaxed pt-1">
                    {item.details}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
