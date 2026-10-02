"use client";

import { useState } from "react";
import { CONTACT_EMAIL, contactMailto, contactLimits, validateContact, type ContactErrors } from "@/lib/contact";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const isError = Object.keys(errors).length > 0;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const { fields, errors: invalid } = validateContact(Object.fromEntries(new FormData(form)));
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      setMessage("Please check the highlighted fields.");
      form.querySelector<HTMLElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    // Open a draft in the visitor's configured mail app; only they can send it.
    window.location.href = contactMailto(fields);
    setMessage("Finish sending the draft in your email app. Your answers are still here if you need them.");
  }

  const fieldClass = "glass-chip w-full min-w-0 rounded-xl px-4 py-3.5 text-base text-ink-50 outline-none placeholder:text-ink-50/35 focus-visible:border-klein focus-visible:ring-2 focus-visible:ring-klein/60 disabled:opacity-60";
  const labelClass = "mb-2 block text-sm text-ink-50/85";
  const fieldProps = (name: keyof typeof contactLimits) => ({
    id: `contact-${name}`,
    name,
    maxLength: contactLimits[name],
    required: name !== "linkedin",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: fieldClass,
  });
  const fieldError = (name: keyof typeof contactLimits) => errors[name] && (
    <p id={`contact-${name}-error`} className="mt-2 text-sm text-rose-300">{errors[name]}</p>
  );

  return (
    <div className="glass-strong glass-sheen relative isolate overflow-hidden rounded-[2rem] p-5 sm:p-8 md:p-10">
      <form onSubmit={submit} action={`mailto:${CONTACT_EMAIL}`} method="post" encType="text/plain" noValidate>
        <h2 className="display text-2xl">Let’s connect.</h2>
        <p className="mb-7 mt-3 text-sm leading-relaxed text-ink-50/60">Tell me a little about yourself and what you’d like to discuss. All fields are required except LinkedIn.</p>
        <fieldset className="min-w-0 space-y-5">
          <legend className="sr-only">Your contact questionnaire</legend>
          <div>
            <label htmlFor="contact-name" className={labelClass}>Your name</label>
            <input {...fieldProps("name")} type="text" autoComplete="name" placeholder="Your name" />
            {fieldError("name")}
          </div>
          <div>
            <label htmlFor="contact-about" className={labelClass}>Who are you?</label>
            <textarea {...fieldProps("about")} rows={3} placeholder="Your role, organization, or a little about yourself." />
            {fieldError("about")}
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>Your email</label>
            <input {...fieldProps("email")} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@somewhere.com" />
            {fieldError("email")}
          </div>
          <div>
            <label htmlFor="contact-linkedin" className={labelClass}>LinkedIn <span className="text-ink-50/50">(optional)</span></label>
            <input {...fieldProps("linkedin")} type="url" autoCapitalize="none" spellCheck={false} placeholder="https://www.linkedin.com/in/your-name" />
            {fieldError("linkedin")}
          </div>
          <div>
            <label htmlFor="contact-message" className={labelClass}>Why would you like to connect?</label>
            <textarea {...fieldProps("message")} rows={5} placeholder="What would you like to talk about? Share any context that would help." />
            {fieldError("message")}
          </div>
          <p className="text-xs leading-relaxed text-ink-50/50">Opens an email draft addressed to me. Review and send it in your email app — no website login needed.</p>
          <button type="submit" className="w-full rounded-full bg-ink-50 px-4 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-950 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-klein">
            Open email app
          </button>
        </fieldset>
      </form>
      <p role={isError ? "alert" : "status"} className={`mt-5 min-h-5 text-center text-sm ${isError ? "text-rose-300" : "text-ink-50/70"}`}>{message}</p>
      {message && (
        <p className="mt-3 text-center text-sm text-ink-50/65">Or <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">email me directly</a> at {CONTACT_EMAIL}.</p>
      )}
    </div>
  );
}
