export interface Testimonial {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  content: string;
  size: "small" | "medium" | "large";
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [];
