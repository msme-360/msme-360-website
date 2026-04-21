
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin, Quote, Star, Plus, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { TESTIMONIALS } from "./CareersData";

interface TestimonialsSectionProps {
  showAllTestimonials: boolean;
  setShowAllTestimonials: (show: boolean) => void;
  expandedCards: Record<string, boolean>;
  toggleExpand: (name: string) => void;
  handleViewLess: () => void;
  renderContentWithHighlights: (content: string) => React.ReactNode;
}

export default function TestimonialsSection({
  showAllTestimonials,
  setShowAllTestimonials,
  expandedCards,
  toggleExpand,
  handleViewLess,
  renderContentWithHighlights
}: TestimonialsSectionProps) {
  return (
    <div className="mt-32 mb-20 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
          Life at MSME 360
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Hear directly from our team about their growth and impact.
        </p>
      </div>
      <div className="relative group/section">
        {!showAllTestimonials ? (
          <div className="relative overflow-hidden w-full py-12">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity
              }}
              className="flex gap-6 w-max cursor-pointer hover:[animation-play-state:paused]"
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                <div
                  key={`${testimonial.name}-${idx}`}
                  className={`glass-card p-8 h-[400px] shrink-0 border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${
                    testimonial.size === 'large' ? 'w-[450px]' : testimonial.size === 'medium' ? 'w-[400px]' : 'w-[350px]'
                  }`}
                >
                  <div className="flex flex-col h-full space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-white/10 ring-4 ring-primary/5">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover" />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white flex items-center gap-2">
                          {testimonial.name}
                          <Link href={testimonial.linkedin} target="_blank" rel="noopener noreferrer" className="relative z-30 pointer-events-auto">
                            <Linkedin className="w-4 h-4 text-muted-foreground hover:text-blue-400 transition-colors" />
                          </Link>
                        </h4>
                        <p className="text-xs text-primary/70 uppercase font-black tracking-widest">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-indigo-100/60 leading-relaxed italic line-clamp-6">
                      &quot;{renderContentWithHighlights(testimonial.content)}&quot;
                    </p>
                    <div className="pt-2 flex items-center justify-between mt-auto">
                      <div className="flex gap-1 items-center">
                        {[1, 2, 3, 4, 5].map(s => {
                          const fillPercentage = Math.max(0, Math.min(100, (testimonial.rating - (s - 1)) * 100));
                          return (
                            <div key={s} className="relative w-3.5 h-3.5">
                              <Star className="w-full h-full text-white/10" />
                              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                <Star className="w-3.5 h-3.5 fill-primary text-primary drop-shadow-glow" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-transparent to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#030711] via-[#030711]/80 to-transparent z-30 flex flex-col items-center justify-end pb-8">
              <Button
                onClick={() => {
                  setShowAllTestimonials(true);
                }}
                className="group h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 rounded-2xl transition-all duration-500 pointer-events-auto"
              >
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Plus className="w-4 h-4" /> View All Reviews
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {TESTIMONIALS.map((testimonial, idx) => {
                const isExpanded = expandedCards[testimonial.name];
                const needsMore = testimonial.content.length > 200;

                return (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`glass-card p-8 relative transition-all duration-500 hover:border-primary/40 shadow-2xl hover:shadow-primary/10 h-fit break-inside-avoid mb-6 ${
                      isExpanded ? 'z-20' : 'z-10'
                    }`}
                  >
                    <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/5" />
                    <div className="flex flex-col h-full space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-white/10 ring-4 ring-primary/5 shadow-inner">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover" />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-white flex items-center gap-2">
                            {testimonial.name}
                            <Link href={testimonial.linkedin} target="_blank" rel="noopener noreferrer" className="relative z-30 pointer-events-auto">
                              <Linkedin className="w-4 h-4 text-muted-foreground hover:text-blue-400 transition-colors" />
                            </Link>
                          </h4>
                          <p className="text-xs text-primary/70 uppercase font-black tracking-widest">{testimonial.role}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <p className={`text-sm text-indigo-100/60 leading-relaxed italic whitespace-pre-wrap transition-all duration-500 ${
                          !isExpanded && needsMore ? 'line-clamp-6' : ''
                        }`}>
                          &quot;{renderContentWithHighlights(testimonial.content)}&quot;
                        </p>
                        {needsMore && (
                          <button
                            onClick={() => toggleExpand(testimonial.name)}
                            className="my-4 text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                          >
                            {isExpanded ? (
                              <><ChevronUp className="w-3 h-3" /> Show Less</>
                            ) : (
                              <><ChevronDown className="w-3 h-3" /> Read More</>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between mt-auto">
                        <div className="flex gap-1 items-center">
                          {[1, 2, 3, 4, 5].map(s => {
                            const fillPercentage = Math.max(0, Math.min(100, (testimonial.rating - (s - 1)) * 100));
                            return (
                              <div key={s} className="relative w-3.5 h-3.5">
                                <Star className="w-full h-full text-white/10" />
                                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                  <Star className="w-3.5 h-3.5 fill-primary text-primary drop-shadow-glow" />
                                </div>
                              </div>
                            );
                          })}
                          <span className="text-[10px] font-bold text-primary/60 ml-1 mt-0.5">{testimonial.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-40">Verified Experience</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center mt-12 pb-12">
              <Button
                variant="ghost"
                onClick={handleViewLess}
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
              >
                <ChevronUp className="w-4 h-4" /> View Less
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
