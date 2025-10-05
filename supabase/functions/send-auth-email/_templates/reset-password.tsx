import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface ResetPasswordEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
}

export const ResetPasswordEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: ResetPasswordEmailProps) => {
  const resetUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your AURA Scrubs password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password 🔒</Heading>
          <Text style={text}>
            We received a request to reset your AURA Scrubs account password.
          </Text>
          <Text style={text}>
            Click the button below to create a new password:
          </Text>
          <Section style={buttonContainer}>
            <Link href={resetUrl} style={button}>
              Reset Password
            </Link>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={linkText}>{resetUrl}</Text>
          <Text style={warning}>
            ⚠️ This link will expire in 60 minutes for security reasons.
          </Text>
          <Text style={footer}>
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </Text>
          <Text style={signature}>
            Best regards,
            <br />
            The AURA Scrubs Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
};

const text = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1",
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const linkText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
  wordBreak: "break-all" as const,
};

const warning = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0",
  padding: "12px 16px",
};

const footer = {
  color: "#8a8a8a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0",
};

const signature = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "24px 0 0",
};
