export const CONTACT_EMAIL = "joychen0709@gmail.com";

export const contactLimits = { name: 120, about: 1000, email: 254, linkedin: 300, message: 5000 };
export type ContactFields = Record<keyof typeof contactLimits, string>;
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function contactMailto(fields: ContactFields): string {
  const subject = `Let’s connect — ${fields.name}`;
  const body = [
    "Hi Joy,", "",
    `Name: ${fields.name}`, `Email: ${fields.email}`,
    `LinkedIn: ${fields.linkedin || "Not provided"}`, "",
    "Who I am:", fields.about, "",
    "Why I’d like to connect:", fields.message,
  ].join("\r\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function validateContact(input: unknown): { fields: ContactFields; errors: ContactErrors } {
  const data = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const fields = Object.fromEntries(
    Object.keys(contactLimits).map((key) => [key, typeof data[key] === "string" ? data[key].trim() : ""])
  ) as ContactFields;
  const errors: ContactErrors = {};
  for (const key of Object.keys(contactLimits) as (keyof ContactFields)[]) {
    if (key !== "linkedin" && !fields[key]) errors[key] = "Please fill out this field.";
    if (fields[key].length > contactLimits[key]) errors[key] = `Please use ${contactLimits[key]} characters or fewer.`;
  }
  if (/[\x00-\x1f\x7f]/.test(fields.name)) errors.name = "Please enter your name on one line.";
  if (fields.email && !/^[^\s@<>(),;:\\"]+@[^\s@<>(),;:\\"]+\.[^\s@<>(),;:\\"]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (fields.linkedin) {
    try {
      const url = new URL(fields.linkedin);
      if (url.protocol !== "https:" || url.username || url.password ||
          !(url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))) throw new Error();
    } catch {
      errors.linkedin = "Please use a LinkedIn URL starting with https://, or leave this blank.";
    }
  }
  return { fields, errors };
}
