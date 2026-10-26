"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { Send, Loader2 } from "lucide-react";

interface ContactFormProps {
  className?: string;
}

type ContactResponse = {
  success?: boolean;
  saved?: boolean;
  delivered?:
    | boolean
    | { email?: boolean; whatsapp?: boolean };
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export function ContactForm({ className }: ContactFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      newErrors.subject = "Subjek minimal 5 karakter";
    }
    if (!formData.message.trim() || formData.message.trim().length < 20) {
      newErrors.message = "Pesan minimal 20 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          honeypot: formData.honeypot,
        }),
      });

      const data = (await res.json()) as ContactResponse;

      if (!res.ok) {
        const fieldError = data.errors
          ? Object.values(data.errors).flat()[0]
          : undefined;
        throw new Error(data.error || fieldError || "Gagal mengirim pesan");
      }

      const delivered = data.delivered;
      const anyDelivered =
        typeof delivered === "object"
          ? Boolean(delivered.email || delivered.whatsapp)
          : delivered === true;

      const message =
        data.message ||
        (anyDelivered
          ? "Pesan terkirim. Kami akan membalas segera."
          : "Pesan tersimpan, tetapi notifikasi belum terkirim.");

      setFeedback({
        type: anyDelivered ? "success" : "info",
        message,
      });
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      showToast(message, anyDelivered ? "success" : "info");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengirim pesan";
      setFeedback({ type: "error", message });
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-md border px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-700 bg-gray-900/50 focus:border-primary"
            }`}
            placeholder="Nama Anda"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3z" stroke="currentColor" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-md border px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] ${
              errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-700 bg-gray-900/50 focus:border-primary"
            }`}
            placeholder="email@domain.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3z" stroke="currentColor" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Subjek
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full rounded-md border px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] ${
              errors.subject ? "border-red-500 focus:ring-red-500" : "border-gray-700 bg-gray-900/50 focus:border-primary"
            }`}
            placeholder="Subjek pesan"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3z" stroke="currentColor" />
              </svg>
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Pesan
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full rounded-md border px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] resize-y min-h-[120px] ${
              errors.message ? "border-red-500 focus:ring-red-500" : "border-gray-700 bg-gray-900/50 focus:border-primary"
            }`}
            placeholder="Tulis pesan Anda di sini..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3z" stroke="currentColor" />
              </svg>
              {errors.message}
            </p>
          )}
        </div>

        <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot}
            onChange={handleChange}
          />
        </div>

        {feedback && (
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${
              feedback.type === "success"
                ? "text-green-400"
                : feedback.type === "info"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-600 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Kirim Pesan
              </>
            )}
          </button>
        </div>
      </div>
      </form>
    );
  }