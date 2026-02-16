'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface DistanceGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DistanceGuide({ isOpen, onToggle }: DistanceGuideProps) {
  const { t } = useTranslation();

  return (
    <div
      className="mx-6 mt-2 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--results-bg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150 cursor-pointer"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-sm font-medium font-heading">
          {t.distanceGuideTitle}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="guide-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5">
              {/* SVG Illustration */}
              <div
                className="rounded-xl p-4 flex justify-center"
                style={{ background: 'var(--input-bg)' }}
              >
                <svg
                  viewBox="0 0 400 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-md"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {/* TV */}
                  <rect
                    x="30"
                    y="20"
                    width="60"
                    height="40"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="60"
                    y1="60"
                    x2="60"
                    y2="70"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="45"
                    y1="70"
                    x2="75"
                    y2="70"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <text
                    x="60"
                    y="14"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                    fontWeight="600"
                  >
                    TV
                  </text>

                  {/* Distance arrow */}
                  <line
                    x1="100"
                    y1="45"
                    x2="280"
                    y2="45"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <polygon
                    points="100,45 110,40 110,50"
                    fill="var(--color-primary)"
                  />
                  <polygon
                    points="280,45 270,40 270,50"
                    fill="var(--color-primary)"
                  />
                  <text
                    x="190"
                    y="38"
                    textAnchor="middle"
                    fill="var(--color-primary)"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {t.distanceGuideArrow}
                  </text>

                  {/* Person on sofa */}
                  <circle
                    cx="310"
                    cy="28"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M310 38 L310 58"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M310 58 L300 75"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M310 58 L320 75"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M298 46 L310 42 L322 46"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  {/* Eye indicator */}
                  <circle
                    cx="306"
                    cy="26"
                    r="1.5"
                    fill="var(--color-primary)"
                  />
                  <circle
                    cx="314"
                    cy="26"
                    r="1.5"
                    fill="var(--color-primary)"
                  />

                  {/* Sofa */}
                  <path
                    d="M285 65 Q285 80 295 80 L325 80 Q335 80 335 65"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M280 60 L280 80 Q280 85 285 85 L335 85 Q340 85 340 80 L340 60"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Labels */}
                  <text
                    x="60"
                    y="90"
                    textAnchor="middle"
                    fill="var(--text-dim)"
                    fontSize="10"
                  >
                    {t.distanceGuideTV}
                  </text>
                  <text
                    x="310"
                    y="100"
                    textAnchor="middle"
                    fill="var(--text-dim)"
                    fontSize="10"
                  >
                    {t.distanceGuideSeat}
                  </text>
                </svg>
              </div>

              {/* Measurement Tips */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    className="shrink-0 mt-0.5"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t.distanceGuideTip1}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    className="shrink-0 mt-0.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t.distanceGuideTip2}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    className="shrink-0 mt-0.5"
                  >
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="2" y1="7" x2="2" y2="17" />
                    <line x1="22" y1="7" x2="22" y2="17" />
                    <line x1="7" y1="10" x2="7" y2="14" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="17" y1="10" x2="17" y2="14" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t.distanceGuideTip3}
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
