"use client";

import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};


export function PersonalStory() {
  return (
    <section id="story" className="border-b border-rule">
      <div className="mx-auto max-w-2xl px-5 py-20 md:px-8 md:py-28">
        <motion.p
          {...fade}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted"
        >
          The Story
        </motion.p>

        <motion.h2
          {...fade}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl"
        >
          My diabetes story.
        </motion.h2>

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-5 text-[17px] leading-[1.65] text-ink/85"
        >
          <p>
            In 2017, I was finishing my first semester at Texas A&amp;M University, running on
            Red Bulls and late nights studying for engineering finals. I was exhausted in a way
            that didn&apos;t feel normal, but I brushed it off like every other college freshman
            probably did.
          </p>
          <p>
            Over 25 pounds lost in a month. Sleeping 12+ hours and still waking up drained.
            Drinking water constantly and still feeling thirsty. My friends pushed me to get
            checked out, and the campus clinic quickly diagnosed me with Type 1 diabetes.
          </p>
          <p>
            I was incredibly lucky I didn&apos;t end up in the hospital. My blood sugar was four
            to five times higher than normal. But at the time, it didn&apos;t feel like luck. It
            felt like something had just been taken off the table for me.
          </p>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-5 text-[17px] leading-[1.65] text-ink/85"
        >
          <p>
            Over time, I learned that I can&apos;t control the diagnosis, but I can control how I
            react to it. That shift has shaped a lot of my life since then. Moving across the
            country. Taking on new challenges. Choosing situations that once would have felt
            harder or more uncertain.
          </p>
          <p>
            And now: training for the New York City Marathon — running 26.2 miles to raise money
            for Beyond Type 1, the nonprofit funding research, advocacy, and support for the T1D
            community.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
