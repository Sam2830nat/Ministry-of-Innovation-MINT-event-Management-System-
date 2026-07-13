"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Coordinating innovation week workshops used to mean endless email chains. MInT EMS put registration, venues, and attendance in one place.",
    name: "Program Officer",
    role: "Research & Innovation Sector",
  },
  {
    quote:
      "I found digital economy seminars and training announcements I would have missed. The discovery feed feels built for ministry work, not campus clubs.",
    name: "Guest Participant",
    role: "ICT & Digital Economy",
  },
  {
    quote:
      "QR check-in and feedback after events finally give us data we can report on — not just sign-in sheets.",
    name: "Event Organizer",
    role: "Technology Development",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
            Trusted across <span className="text-brand">MInT</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Built for Ethiopia&apos;s Ministry of Innovation and Technology — research,
            innovation, technology transfer, and digitalization programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 shadow-sm"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer>
                <p className="font-black text-gray-900 dark:text-white text-sm">
                  {t.name}
                </p>
                <p className="text-xs text-brand font-bold uppercase tracking-widest mt-1">
                  {t.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
