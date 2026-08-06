import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function SvgDiagram({ type = 'flowchart', title = 'Technical Diagram', caption }) {
  const [activeNode, setActiveNode] = useState(null);

  // Render SVG based on diagram type
  const renderDiagramContent = () => {
    switch (type) {
      case 'architecture':
      case 'cpu':
        return (
          <svg className="w-full h-80 max-h-96 text-slate-800 dark:text-slate-100" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            
            {/* Background Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
            <rect width="800" height="400" fill="url(#grid)" />

            {/* Central Bus */}
            <rect x="100" y="195" width="600" height="15" rx="4" fill="url(#busGrad)" className="animate-pulse" />
            <text x="400" y="206" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">SYSTEM BUS (DATA / ADDRESS / CONTROL)</text>

            {/* CPU Box */}
            <g className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setActiveNode('CPU Core')}>
              <rect x="80" y="40" width="280" height="120" rx="8" fill="url(#cpuGrad)" stroke="#3b82f6" strokeWidth="2" />
              <text x="220" y="65" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">CENTRAL PROCESSING UNIT (CPU)</text>
              
              {/* ALU */}
              <rect x="100" y="80" width="110" height="60" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
              <text x="155" y="115" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">ALU</text>

              {/* Control Unit */}
              <rect x="230" y="80" width="110" height="60" rx="4" fill="#3730a3" stroke="#818cf8" strokeWidth="1" />
              <text x="285" y="115" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">Control Unit</text>
            </g>

            {/* Primary Memory (RAM) */}
            <g className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setActiveNode('RAM')}>
              <rect x="440" y="40" width="280" height="120" rx="8" fill="url(#cpuGrad)" stroke="#8b5cf6" strokeWidth="2" />
              <text x="580" y="70" fill="#8b5cf6" fontSize="16" fontWeight="bold" textAnchor="middle">MAIN MEMORY (RAM)</text>
              <rect x="460" y="85" width="240" height="25" rx="3" fill="#4c1d95" stroke="#a78bfa" strokeWidth="1" />
              <text x="580" y="102" fill="#e9d5ff" fontSize="11" textAnchor="middle">L1 / L2 / L3 Cache Layers</text>
              <rect x="460" y="118" width="240" height="25" rx="3" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
              <text x="580" y="135" fill="#f3e8ff" fontSize="11" textAnchor="middle">DRAM Modules (Addressable Cells)</text>
            </g>

            {/* I/O Devices */}
            <g className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setActiveNode('I/O Subsystem')}>
              <rect x="150" y="240" width="220" height="110" rx="8" fill="url(#cpuGrad)" stroke="#10b981" strokeWidth="2" />
              <text x="260" y="270" fill="#10b981" fontSize="15" fontWeight="bold" textAnchor="middle">I/O SUBSYSTEM</text>
              <text x="260" y="295" fill="currentColor" fontSize="12" textAnchor="middle">Keyboard, Mouse, Display</text>
              <text x="260" y="315" fill="currentColor" fontSize="12" textAnchor="middle">Network Interface Controllers</text>
            </g>

            {/* Secondary Storage */}
            <g className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setActiveNode('SSD Storage')}>
              <rect x="430" y="240" width="220" height="110" rx="8" fill="url(#cpuGrad)" stroke="#f59e0b" strokeWidth="2" />
              <text x="540" y="270" fill="#f59e0b" fontSize="15" fontWeight="bold" textAnchor="middle">SECONDARY STORAGE</text>
              <text x="540" y="295" fill="currentColor" fontSize="12" textAnchor="middle">NVMe SSD / HDD Array</text>
              <text x="540" y="315" fill="currentColor" fontSize="12" textAnchor="middle">Virtual Memory Swap Page File</text>
            </g>

            {/* Connection Arrows */}
            <line x1="220" y1="160" x2="220" y2="195" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
            <line x1="580" y1="160" x2="580" y2="195" stroke="#8b5cf6" strokeWidth="3" />
            <line x1="260" y1="210" x2="260" y2="240" stroke="#10b981" strokeWidth="3" />
            <line x1="540" y1="210" x2="540" y2="240" stroke="#f59e0b" strokeWidth="3" />
          </svg>
        );

      case 'tree':
        return (
          <svg className="w-full h-80 max-h-96 text-slate-800 dark:text-slate-100" viewBox="0 0 800 360" fill="none">
            {/* Lines */}
            <line x1="400" y1="60" x2="250" y2="150" stroke="#3b82f6" strokeWidth="3" />
            <line x1="400" y1="60" x2="550" y2="150" stroke="#3b82f6" strokeWidth="3" />
            <line x1="250" y1="150" x2="160" y2="250" stroke="#3b82f6" strokeWidth="3" />
            <line x1="250" y1="150" x2="340" y2="250" stroke="#3b82f6" strokeWidth="3" />
            <line x1="550" y1="150" x2="460" y2="250" stroke="#3b82f6" strokeWidth="3" />
            <line x1="550" y1="150" x2="640" y2="250" stroke="#3b82f6" strokeWidth="3" />

            {/* Nodes */}
            {/* Root */}
            <g className="cursor-pointer" onClick={() => setActiveNode('Root Node (50)')}>
              <circle cx="400" cy="60" r="35" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="3" />
              <text x="400" y="66" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">50</text>
              <text x="400" y="15" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">ROOT NODE</text>
            </g>

            {/* Level 1 Left */}
            <g className="cursor-pointer" onClick={() => setActiveNode('Left Subtree (30)')}>
              <circle cx="250" cy="150" r="30" fill="#2563eb" stroke="#93c5fd" strokeWidth="3" />
              <text x="250" y="156" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">30</text>
            </g>

            {/* Level 1 Right */}
            <g className="cursor-pointer" onClick={() => setActiveNode('Right Subtree (70)')}>
              <circle cx="550" cy="150" r="30" fill="#2563eb" stroke="#93c5fd" strokeWidth="3" />
              <text x="550" y="156" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">70</text>
            </g>

            {/* Level 2 Leaves */}
            <g className="cursor-pointer" onClick={() => setActiveNode('Leaf Node (15)')}>
              <circle cx="160" cy="250" r="25" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="160" y="255" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">15</text>
            </g>
            <g className="cursor-pointer" onClick={() => setActiveNode('Leaf Node (40)')}>
              <circle cx="340" cy="250" r="25" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="340" y="255" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">40</text>
            </g>
            <g className="cursor-pointer" onClick={() => setActiveNode('Leaf Node (60)')}>
              <circle cx="460" cy="250" r="25" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="460" y="255" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">60</text>
            </g>
            <g className="cursor-pointer" onClick={() => setActiveNode('Leaf Node (90)')}>
              <circle cx="640" cy="250" r="25" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="640" y="255" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">90</text>
            </g>
          </svg>
        );

      case 'process':
        return (
          <svg className="w-full h-80 max-h-96 text-slate-800 dark:text-slate-100" viewBox="0 0 800 360" fill="none">
            {/* States */}
            {/* New */}
            <rect x="50" y="140" width="100" height="60" rx="30" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
            <text x="100" y="175" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">NEW</text>

            {/* Ready */}
            <rect x="250" y="140" width="110" height="60" rx="30" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <text x="305" y="175" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">READY</text>

            {/* Running */}
            <rect x="470" y="140" width="120" height="60" rx="30" fill="#16a34a" stroke="#4ade80" strokeWidth="2" />
            <text x="530" y="175" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">RUNNING</text>

            {/* Waiting */}
            <rect x="360" y="260" width="110" height="60" rx="30" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
            <text x="415" y="295" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">WAITING</text>

            {/* Terminated */}
            <rect x="670" y="140" width="110" height="60" rx="30" fill="#dc2626" stroke="#f87171" strokeWidth="2" />
            <text x="725" y="175" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">TERMINATED</text>

            {/* Connections */}
            <line x1="150" y1="170" x2="250" y2="170" stroke="#3b82f6" strokeWidth="3" />
            <text x="200" y="160" fill="#3b82f6" fontSize="11" textAnchor="middle">Admitted</text>

            <line x1="360" y1="170" x2="470" y2="170" stroke="#3b82f6" strokeWidth="3" />
            <text x="415" y="160" fill="#3b82f6" fontSize="11" textAnchor="middle">Scheduler Dispatch</text>

            <line x1="590" y1="170" x2="670" y2="170" stroke="#16a34a" strokeWidth="3" />
            <text x="630" y="160" fill="#16a34a" fontSize="11" textAnchor="middle">Exit</text>

            <path d="M 530 200 L 530 290 L 470 290" fill="none" stroke="#d97706" strokeWidth="2" />
            <text x="545" y="245" fill="#d97706" fontSize="11">I/O Wait</text>

            <path d="M 360 290 L 305 290 L 305 200" fill="none" stroke="#d97706" strokeWidth="2" />
            <text x="270" y="245" fill="#d97706" fontSize="11">I/O Done</text>
          </svg>
        );

      case 'network':
      case 'erd':
      case 'circuit':
      case 'flowchart':
      default:
        return (
          <svg className="w-full h-80 max-h-96 text-slate-800 dark:text-slate-100" viewBox="0 0 800 360" fill="none">
            {/* Start */}
            <rect x="50" y="150" width="120" height="60" rx="30" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
            <text x="110" y="185" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">START</text>

            {/* Process 1 */}
            <rect x="230" y="150" width="140" height="60" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" />
            <text x="300" y="177" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">Initialize Engine</text>
            <text x="300" y="195" fill="#93c5fd" fontSize="10" textAnchor="middle">Alloc Pointers</text>

            {/* Decision */}
            <polygon points="490,140 560,180 490,220 420,180" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" />
            <text x="490" y="184" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Valid State?</text>

            {/* End */}
            <rect x="640" y="150" width="120" height="60" rx="30" fill="#059669" stroke="#34d399" strokeWidth="2" />
            <text x="700" y="185" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">SUCCESS</text>

            {/* Arrows */}
            <line x1="170" y1="180" x2="230" y2="180" stroke="#3b82f6" strokeWidth="3" />
            <line x1="370" y1="180" x2="420" y2="180" stroke="#3b82f6" strokeWidth="3" />
            <line x1="560" y1="180" x2="640" y2="180" stroke="#059669" strokeWidth="3" />
            <text x="595" y="170" fill="#059669" fontSize="12" fontWeight="bold">YES</text>

            <path d="M 490 220 L 490 280 L 300 280 L 300 210" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
            <text x="400" y="275" fill="#dc2626" fontSize="11" fontWeight="bold">NO (Retry Pipeline)</text>
          </svg>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></span>
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{caption || 'Interactive vector SVG engineering blueprint. Hover over elements to inspect details.'}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
          SVG Vector Engine
        </span>
      </div>

      <div className="relative bg-slate-950/5 dark:bg-navy-950/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/80 overflow-x-auto">
        {renderDiagramContent()}
      </div>

      {activeNode && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-brand-50 dark:bg-brand-950/40 rounded-lg border border-brand-200 dark:border-brand-800/60 text-xs text-brand-900 dark:text-brand-200 flex items-center justify-between"
        >
          <span><strong>Selected Subsystem:</strong> {activeNode} — Operating in optimal parameters.</span>
          <button onClick={() => setActiveNode(null)} className="text-brand-600 hover:text-brand-800 font-bold ml-2">Close</button>
        </motion.div>
      )}
    </motion.div>
  );
}
