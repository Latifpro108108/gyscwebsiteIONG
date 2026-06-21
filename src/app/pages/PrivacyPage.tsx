import { Label, PageShell } from "@/app/components/shared";
import { T } from "@/app/lib/theme";

export function PrivacyPage() {
  return (
    <PageShell>
      <div className="page-header">
        <Label>Legal</Label>
        <h1 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, color: T.navy, letterSpacing: "-1px", lineHeight: 1.08, marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 16, color: T.muted }}>Last updated: June 2025</p>
      </div>

      <div className="legal-content">
        <p>
          The Global Youth Sustainability Council ("GYSC") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard personal information when you visit our website or interact with our programmes.
        </p>
        <h2>Information we collect</h2>
        <p>
          We may collect information you provide directly, such as your name, email address, country, and organisation when you subscribe to our newsletter, register interest in membership, or submit a partnership inquiry.
        </p>
        <h2>How we use your information</h2>
        <p>
          We use collected information to respond to inquiries, share newsletters and programme updates, improve our services, and comply with legal obligations as a registered Canadian NGO.
        </p>
        <h2>Data sharing</h2>
        <p>
          GYSC does not sell personal data. We may share information with service providers who assist our operations, subject to appropriate confidentiality and security safeguards.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy-related questions, contact the GYSC data protection team through our official channels.
        </p>
      </div>
    </PageShell>
  );
}
