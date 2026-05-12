import { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms and Conditions | MSME 360",
  description: "Read the terms and conditions for using MSME 360 platform and services.",
};

export default function TermsPage() {
  return <TermsClient />;
}
