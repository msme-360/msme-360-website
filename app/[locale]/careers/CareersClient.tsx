"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, GraduationCap, ArrowLeft, ArrowRight, Rocket, Star, Shield, Zap, Linkedin, Quote } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Chatresh Konchada",
    role: "Data Engineer Intern",
    image: "/testimonials/chatreesh.jpeg",
    linkedin: "https://www.linkedin.com/in/chatresh-konchada-6075692aa",
    content: "My internship experience at MSME 360 as a Data Engineer Intern has been incredibly rewarding and insightful. During my internship, I had the opportunity to build and optimize data pipelines, work with real-world datasets, and contribute to meaningful projects that enhanced my technical and analytical skills.\n\nThe supportive guidance from the team helped me strengthen my knowledge in data handling, automation, and problem-solving, while understanding how data-driven decisions create business impact. I truly appreciated the professional environment, collaborative culture, and continuous learning opportunities throughout the internship.\n\nI am sincerely grateful to MSME 360 for this valuable experience; I highly recommend it to aspiring professionals seeking hands-on industry exposure and career growth in data science.",
    size: "medium",
    rating: 4.3
  },
  {
    name: "Tanuja Pammina",
    role: "ML Engineer Intern",
    image: "/testimonials/tanuja.jpeg",
    linkedin: "https://www.linkedin.com/in/tanuja-pammina-038b33290",
    content: "At MSME 360, my role as a Junior ML Engineer helped me bridge the gap between theory and real-world application. I worked on impactful projects, improved my machine-learning skills, and gained valuable industry exposure. The collaborative culture and mentorship made it an excellent place for growth and innovation.",
    size: "medium",
    rating: 5.0
  },
  {
    name: "Sowmya Nolli",
    role: "ML Engineer Intern",
    image: "/testimonials/sowmya.jpeg",
    linkedin: "https://www.linkedin.com/in/sowmya-nolli",
    content: "My internship at MSME 360 in the Machine Learning domain was a valuable professional experience.\n\nThe guidance and support from the team lead enabled me to address challenges effectively and maintain consistent progress on the project.\n\nThe work environment provided the right balance of independent responsibility and team collaboration. I worked closely with the ML team on development, testing, and iteration. The flexible work intervals facilitated focused development while ensuring consistent alignment within the team.\n\nI am grateful to MSME 360 for the practical exposure and professional growth afforded during this internship.",
    size: "medium",
    rating: 4.0
  },
  {
    name: "Md. Sheihjadi",
    role: "Data Engineer Intern",
    image: "/testimonials/sheihjadi.jpeg",
    linkedin: "https://www.linkedin.com/in/md-sheihjadi",
    content: "During my internship at MSME 360 as a Data Engineer Intern, I gained hands-on experience in data processing, ETL pipeline development, and working with real-world datasets. I worked on data cleaning, transformation, and pipeline creation, which strengthened my foundation in data engineering and enhanced my skills in tools like Python, SQL, and data handling frameworks. The organization provided a supportive environment and valuable mentorship, allowing me to apply theoretical knowledge to practical problems while significantly improving my problem-solving abilities. I sincerely thank the MSME 360 team for their guidance and support throughout my internship.”",
    size: "medium",
    rating: 4.7
  },
  {
    name: "Kayala Durga Eswar",
    role: "ML Engineer Intern",
    image: "/testimonials/durga-eswar.jpeg",
    linkedin: "https://www.linkedin.com/in/kayaladurgaeswar",
    content: "My internship at MSME 360 was a truly valuable experience that significantly boosted my confidence and practical skills. During my time there, I had the opportunity to lead a team of four members, which helped me develop leadership, coordination, and decision-making abilities in a real-world environment.\n\nWhat stood out the most was the positive and supportive work culture. There was no unnecessary pressure or stress, which allowed me to focus on learning and contributing effectively. The experience provided me with meaningful exposure to real-time work scenarios, enhancing both my personal and professional growth.\n\nAlthough it was an unpaid internship, the knowledge, confidence, and hands-on experience I gained were far more valuable than monetary compensation. I am grateful for the opportunity and the learning it brought into my journey.",
    size: "medium",
    rating: 5.0
  },
  {
    name: "U V Sreeja Hasini",
    role: "FS Developer Intern",
    image: "/testimonials/sreeja.jpeg",
    linkedin: "https://www.linkedin.com/in/venkata-sreeja-hasini-uppalapati-302970358",
    content: "My internship at MSME 360 was a truly valuable experience that significantly boosted my confidence and practical skills. During my time there, I had the opportunity to lead a team of four members, which helped me develop leadership, coordination, and decision-making abilities in a real-world environment.\n\nWhat stood out the most was the positive and supportive work culture. There was no unnecessary pressure or stress, which allowed me to focus on learning and contributing effectively. The experience provided me with meaningful exposure to real-time work scenarios, enhancing both my personal and professional growth.\n\nAlthough it was an unpaid internship, the knowledge, confidence, and hands-on experience I gained were far more valuable than monetary compensation. I am grateful for the opportunity and the learning it brought into my journey.",
    size: "medium",
    rating: 4.5
  },
  {
    name: "Sanapala Abhiram",
    role: "UI/UX Designer Intern",
    image: "/testimonials/abhiram.jpeg",
    linkedin: "https://www.linkedin.com/in/abhiram-sanapala-b09a6a301",
    content: "My time at MSME 360 as a UI/UX Designer was both fun and challenging. I worked on improving the overall user experience by simplifying designs and making things easier to navigate.\n\nI really enjoyed collaborating with the team and turning ideas into practical designs. It helped me grow not just as a designer, but also in understanding how users actually interact with products.",
    size: "medium",
    rating: 5.0
  },
  // {
  //   name: "Kayala Durga Eswar",
  //   role: "ML Intern",
  //   image: "/testimonials/durga-eswar.jpeg",
  //   linkedin: "https://www.linkedin.com/in/kayaladurgaeswar",
  //   content: "My internship at MSME 360 was a truly valuable experience that significantly boosted my confidence and practical skills. During my time there, I had the opportunity to lead a team of four members, which helped me develop leadership, coordination, and decision-making abilities in a real-world environment.\n\nWhat stood out the most was the positive and supportive work culture. There was no unnecessary pressure or stress, which allowed me to focus on learning and contributing effectively. The experience provided me with meaningful exposure to real-time work scenarios, enhancing both my personal and professional growth.\n\nAlthough it was an unpaid internship, the knowledge, confidence, and hands-on experience I gained were far more valuable than monetary compensation. I am grateful for the opportunity and the learning it brought into my journey.",
  //   size: "medium",
  //   rating: 5.0
  // },
  // {
  //   name: "Kayala Durga Eswar",
  //   role: "ML Intern",
  //   image: "/testimonials/durga-eswar.jpeg",
  //   linkedin: "https://www.linkedin.com/in/kayaladurgaeswar",
  //   content: "My internship at MSME 360 was a truly valuable experience that significantly boosted my confidence and practical skills. During my time there, I had the opportunity to lead a team of four members, which helped me develop leadership, coordination, and decision-making abilities in a real-world environment.\n\nWhat stood out the most was the positive and supportive work culture. There was no unnecessary pressure or stress, which allowed me to focus on learning and contributing effectively. The experience provided me with meaningful exposure to real-time work scenarios, enhancing both my personal and professional growth.\n\nAlthough it was an unpaid internship, the knowledge, confidence, and hands-on experience I gained were far more valuable than monetary compensation. I am grateful for the opportunity and the learning it brought into my journey.",
  //   size: "medium",
  //   rating: 5.0
  // },
];

export default function CareersClient() {
  const t = useTranslations("Careers");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params?.locale as string || "en";

  const [selectedCategory, setSelectedCategory] = useState<'internship' | 'job' | null>(
    (searchParams.get('category') as 'internship' | 'job') || null
  );

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleViewLess = () => {
    setShowAllTestimonials(false);
    setExpandedCards({}); // Reset all small "Read More" states
  };

  const setCategory = (cat: 'internship' | 'job' | null) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    router.push(`/${locale}/careers?${newParams.toString()}`, { scroll: false });
  };

  const renderContentWithHighlights = (content: string) => {
    const parts = content.split(/(MSME 360)/g);
    return parts.map((part, i) =>
      part === "MSME 360" ? (
        <span key={i} className="underline decoration-dotted decoration-primary/50 underline-offset-4 font-semibold text-indigo-100/60">
          {part}
        </span>
      ) : part
    );
  };

  const filteredRoles = CAREER_ROLES.filter(r =>
    r.type === selectedCategory && r.slug !== "general"
  );

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
            <Rocket className="w-3 h-3" /> {t("badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6 leading-tight">
            {t("titlePart1")} <br /> {t("titlePart2")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
            >
              {/* Internships Card */}
              <Card
                className="glass-card overflow-hidden group cursor-pointer hover:border-primary/40 transition-all duration-500 border-white/10 bg-white/5"
                onClick={() => setCategory('internship')}
              >
                <div className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{t("categories.internship.title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("categories.internship.desc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                    {t("categories.internship.cta")} <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              {/* Jobs Card */}
              <Card
                className="glass-card overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all duration-500 border-white/10 bg-white/5"
                onClick={() => setCategory('job')}
              >
                <div className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{t("categories.job.title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("categories.job.desc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-500 font-bold group-hover:gap-4 transition-all">
                    {t("categories.job.cta")} <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : selectedCategory === 'internship' ? (
            <motion.section
              key="internships"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategory(null)}
                    className="rounded-full hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{t("internships.title")}</h2>
                    <p className="text-muted-foreground">{t("internships.subtitle")}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 w-fit">
                  {t("internships.count", { count: filteredRoles.length })}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoles.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <Link key={role.slug} href={`/${locale}/careers/${role.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer h-full"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">
                              {role.department}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="glass-card p-12 mt-16 text-center border-dashed"
              >
                <h2 className="text-2xl font-bold mb-4">{t("openApp.title")}</h2>
                <p className="text-muted-foreground mb-8">{t("openApp.desc")}</p>
                <Link href={`/${locale}/careers/general/apply`}>
                  <Button variant="outline" className="font-bold">
                    {t("openApp.cta")}
                  </Button>
                </Link>
              </motion.div>
            </motion.section>
          ) : (
            /* Jobs Opening Soon View */
            <motion.section
              key="jobs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 animate-in fade-in duration-500"
            >
              <Button
                variant="ghost"
                onClick={() => setCategory(null)}
                className="mb-12 hover:bg-white/10 gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t("jobs.back")}
              </Button>
              <div className="max-w-2xl mx-auto glass-card p-16 relative overflow-hidden border-blue-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                  <Briefcase className="w-40 h-40 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-6">{t("jobs.comingSoon")}</Badge>
                <h2 className="text-4xl font-bold mb-6">{t("jobs.title")}</h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  {t("jobs.desc")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href={`/${locale}/careers/general/apply`}>
                    <Button className="font-bold h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-glow shadow-blue-500/20">
                      {t("jobs.cta")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Culture / Value Props - Only show on selection view to keep it clean */}
        {!selectedCategory && (
          <>
            {/* Testimonials Section - Scrolling Bento Grid */}
            <div className="mt-32 mb-20 overflow-hidden">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
                  {t("testimonials.title")}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {t("testimonials.subtitle")}
                </p>
              </div>
              <div className="relative group/section">
                {!showAllTestimonials ? (
                  /* Collapsed State: Infinite Marquee */
                  <div className="relative overflow-hidden w-full py-12">
                    <motion.div
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        duration: 30, // Slowed down slightly for better legibility
                        ease: "linear",
                        repeat: Infinity
                      }}
                      className="flex gap-6 w-max cursor-pointer hover:[animation-play-state:paused]"
                    >
                      {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                        <div
                          key={`${testimonial.name}-${idx}`}
                          className={`glass-card p-8 h-[400px] shrink-0 border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${testimonial.size === 'large' ? 'w-[450px]' : testimonial.size === 'medium' ? 'w-[400px]' : 'w-[350px]'
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

                    {/* Shadow Overlays and View More Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-transparent to-transparent pointer-events-none z-20" />
                    <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#030711] via-[#030711]/80 to-transparent z-30 flex flex-col items-center justify-end pb-8">
                      <Button
                        onClick={() => {
                          const allExpanded = TESTIMONIALS.reduce((acc, t) => ({ ...acc, [t.name]: true }), {});
                          setExpandedCards(allExpanded);
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
                  /* Expanded State: Static Bento Grid */
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
                            className={`glass-card p-8 relative transition-all duration-500 hover:border-primary/40 shadow-2xl hover:shadow-primary/10 h-fit break-inside-avoid mb-6 ${isExpanded ? 'z-20' : 'z-10'
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
                                <p className={`text-sm text-indigo-100/60 leading-relaxed italic whitespace-pre-wrap transition-all duration-500 ${!isExpanded && needsMore ? 'line-clamp-6' : ''
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
                <CardContent className="pt-6">
                  <Star className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-2">{t("values.impact.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("values.impact.desc")}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
                <CardContent className="pt-6">
                  <Shield className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-2">{t("values.accountability.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("values.accountability.desc")}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
                <CardContent className="pt-6">
                  <Zap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-2">{t("values.speed.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("values.speed.desc")}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
