import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | MSME 360",
  description: "Learn how MSME 360 handles your data and protects your privacy.",
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
