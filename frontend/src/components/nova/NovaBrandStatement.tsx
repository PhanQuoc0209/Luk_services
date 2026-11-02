'use client';

import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export function NovaBrandStatement() {
  const tenets = [
    {
      number: '01',
      title: 'Student-focused',
      description:
        'Thấu hiểu áp lực và nhịp sống giảng đường. Mọi giải pháp đều được thiết kế linh hoạt, thực tế và tối ưu cho ngân sách sinh viên.',
    },
    {
      number: '02',
      title: 'Quality-driven',
      description:
        'Không sản xuất hàng loạt hay dùng mẫu đại trà. Từng sản phẩm đều được chăm chút tỉ mỉ với tư duy thẩm mỹ và tiêu chuẩn cao cấp.',
    },
    {
      number: '03',
      title: 'Time-conscious',
      description:
        'Kỷ luật với mọi mốc thời gian. Luôn đảm bảo bàn giao đúng tiến độ để bạn tự tin chuẩn bị cho thuyết trình hay nộp hồ sơ.',
    },
  ];

  return (
    <section
      id="brand-statement"
      aria-label="Tuyên ngôn thương hiệu NOVA"
      className="relative bg-nova-ivory text-nova-navy py-24 sm:py-32 overflow-hidden transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Eyebrow & Philosophy */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-nova-champagne" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-slate">
              Philosophy &amp; Commitment
            </span>
          </div>
        </ScrollReveal>

        {/* Main Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-16 sm:pb-20 border-b border-slate-200/80">
          <div className="lg:col-span-8">
            <ScrollReveal delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-nova-navy leading-[1.18] tracking-tight">
                Không chỉ hoàn thành một công việc.{' '}
                <span className="font-serif italic font-normal text-nova-blue text-[1.08em] block sm:inline mt-1 sm:mt-0">
                  Mà là tạo nên bước tiến tiếp theo của bạn.
                </span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between pt-2">
            <ScrollReveal delay={200}>
              <p className="text-sm sm:text-base text-nova-slate font-body leading-relaxed mb-6">
                “More than getting things done. It’s about making your next move.”
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                NOVA ra đời để trở thành điểm tựa vững chắc cho những sinh viên khao khát khẳng định bản thân.
                Chúng tôi không chỉ xử lý yêu cầu — chúng tôi nâng tầm cách bạn xuất hiện trước giảng đường và nhà tuyển dụng.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* 3 Pillars Grid with Editorial Touch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-14 sm:pt-16">
          {tenets.map((item, idx) => (
            <ScrollReveal key={item.number} delay={150 * (idx + 1)}>
              <div className="space-y-4 group">
                <div className="flex items-baseline justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-sm font-semibold tracking-wider text-nova-navy">
                    {item.title}
                  </span>
                  <span className="font-serif italic text-base text-nova-champagne font-normal">
                    {item.number}
                  </span>
                </div>
                <p className="text-sm text-nova-slate leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Editorial Accent Strip: Authentic Student Studio Glimpse */}
        <ScrollReveal delay={300} className="mt-16 sm:mt-20">
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              <div className="md:col-span-7 p-8 sm:p-12 lg:p-14 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-nova-blue/10 text-nova-blue text-[11px] font-semibold tracking-wider uppercase">
                  Direct In-House Studio
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy tracking-tight">
                  Đội ngũ chuyên trách trực tiếp, không qua trung gian.
                </h3>
                <p className="text-sm text-nova-slate leading-relaxed">
                  Tại NOVA, bạn làm việc trực tiếp với đội ngũ thiết kế, biên tập và cố vấn giàu kinh nghiệm.
                  Mọi yêu cầu đều được lắng nghe, bảo mật và đồng hành xuyên suốt từ bản thảo đầu tiên đến sản phẩm hoàn thiện.
                </p>
              </div>
              <div className="md:col-span-5 h-64 md:h-full min-h-[260px] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                  alt="Sinh viên trao đổi và cùng nhau hoàn thiện dự án"
                  className="w-full h-full object-cover object-center filter grayscale-[15%] contrast-[1.05] hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
