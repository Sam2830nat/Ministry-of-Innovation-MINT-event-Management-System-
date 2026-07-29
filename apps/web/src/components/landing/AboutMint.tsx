"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  FlaskConical,
  Cpu,
  Network,
  Lightbulb,
} from "lucide-react";

const focusAreas = [
  {
    icon: FlaskConical,
    title: "Research",
    desc: "Advancing scientific research that delivers sustainable development solutions for Ethiopia.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Building a national innovation ecosystem — from startups to research partnerships.",
  },
  {
    icon: Cpu,
    title: "Technology Transfer",
    desc: "Developing and transferring technology across government, industry, and academia.",
  },
  {
    icon: Network,
    title: "Digitalization",
    desc: "Driving ICT infrastructure, e-government, and Ethiopia’s digital economy.",
  },
];

export default function AboutMint() {
  return (
    <section
      id="about-mint"
      className="relative py-28 px-6 md:px-12 overflow-hidden bg-white dark:bg-black"
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#085464_1px,transparent_1px)] bg-size-[40px_40px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-14"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand mb-4">
            About the Ministry
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 leading-tight">
            Ethiopian Ministry of{" "}
            <span className="text-brand">Innovation &amp; Technology</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed font-medium mb-4">
            Formed in 2019 by merging the former Ministry of Science and Technology
            and the Ministry of Communication and Information Technology,{" "}
            <strong className="text-gray-800 dark:text-gray-200">MInT</strong> leads
            Ethiopia’s research, innovation, technology transfer, and digitalization
            agenda — moving from facilitator to main actor in national development.
          </p>
          <p className="text-gray-500 text-base leading-relaxed font-medium mb-8">
            This Event Management System helps MInT staff, partners, and guests
            discover, organize, and participate in ministry programs — workshops,
            seminars, innovation weeks, digital economy forums, and more.
          </p>
          <a
            href="http://www.mint.gov.et/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest hover:underline"
          >
            Visit the official MInT website
            <ExternalLink size={14} />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                <area.icon size={22} />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white tracking-tight mb-2">
                {area.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{area.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-sm text-gray-400"
        >
          Contact:{" "}
          <a href="tel:+251118132191" className="hover:text-brand">
            +251 11 813 2191
          </a>
          {" · "}
          <a href="mailto:contact@mint.gov.et" className="hover:text-brand">
            contact@mint.gov.et
          </a>
          {" · "}
          <a
            href="http://www.mint.gov.et/"
            className="hover:text-brand"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.mint.gov.et
          </a>
        </motion.p>
      </div>
    </section>
  );
}
