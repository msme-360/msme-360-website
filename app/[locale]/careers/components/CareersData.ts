export interface Testimonial {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  content: string;
  size: "small" | "medium" | "large";
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
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
    linkedin: "https://www.linkedin.com/in/mohammad-sheihjadi-75a41b330",
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
  }
];
