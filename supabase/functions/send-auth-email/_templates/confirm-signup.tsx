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

interface ConfirmSignupEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
}

export const ConfirmSignupEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: ConfirmSignupEmailProps) => {
  const confirmUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to AURA Scrubs - Confirm your email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to AURA Scrubs! 🩺</Heading>
          <Text style={text}>
            Thank you for joining AURA Scrubs, where comfort meets style in medical apparel.
          </Text>
          <Text style={text}>
            To complete your registration and start shopping, please confirm your email address by clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Link href={confirmUrl} style={button}>
              Confirm Email Address
            </Link>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={linkText}>{confirmUrl}</Text>
          <Text style={footer}>
            If you didn't create an account with AURA Scrubs, you can safely ignore this email.
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

export default ConfirmSignupEmail;

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
  backgroundColor: "#2563eb",
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
