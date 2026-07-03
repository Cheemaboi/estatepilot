type InquiryEmailInput = {
  email: string;
  fullName: string;
  message: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  propertyTitle: string;
  slug: string;
  tourFormat: string;
};

type ResendResponse = {
  id?: string;
  message?: string;
};

export function hasEmailEnv() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.INQUIRY_EMAIL_TO &&
      process.env.INQUIRY_EMAIL_FROM,
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendInquiryEmail(input: InquiryEmailInput) {
  if (!hasEmailEnv()) {
    return {
      sent: false,
      skippedReason: "Email env vars are not configured.",
    };
  }

  const detailLines = [
    `Property: ${input.propertyTitle}`,
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.preferredDate ? `Preferred date: ${input.preferredDate}` : "",
    input.preferredTime ? `Preferred time: ${input.preferredTime}` : "",
    input.tourFormat ? `Tour format: ${input.tourFormat}` : "",
    input.message ? `Message: ${input.message}` : "",
  ].filter(Boolean);
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: process.env.INQUIRY_EMAIL_FROM,
      html: `<h2>New EstatePilot inquiry</h2><p>${detailLines
        .map((line) => escapeHtml(line))
        .join("</p><p>")}</p>`,
      reply_to: input.email,
      subject: `New inquiry for ${input.propertyTitle}`,
      text: detailLines.join("\n"),
      to: process.env.INQUIRY_EMAIL_TO,
    }),
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `estatepilot-${input.slug}-${Date.now()}`,
    },
    method: "POST",
  });

  const data = (await response.json()) as ResendResponse;

  if (!response.ok) {
    return {
      error: data.message ?? `Resend request failed with ${response.status}`,
      sent: false,
    };
  }

  return {
    id: data.id,
    sent: true,
  };
}
