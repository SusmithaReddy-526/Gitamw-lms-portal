import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { Search, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';

export function GlobalSearch({ onSelectTopic }) {
  const [query, setQuery] = useState('');
  const curriculum = dbService.getCurriculum();

  // Search filter matching topic name, subject name, unit title, branch, or year
  const searchResults = [];

  if (query.trim().length > 1) {
    const q = query.toLowerCase().trim();
    curriculum.forEach(sub => {
      sub.units?.forEach(unit => {
        unit.topics?.forEach(topic => {
          if (
            topic.name.toLowerCase().includes(q) ||
            sub.subjectName.toLowerCase().includes(q) ||
            sub.subjectCode.toLowerCase().includes(q) ||
            unit.title.toLowerCase().includes(q) ||
            sub.branchId.toLowerCase().includes(q) ||
            sub.yearId.toLowerCase().includes(q)
          ) {
            searchResults.push({
              topic,
              unit,
              subject: sub
            });
          }
        });
      });
    });
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-outfit">
          Global Academic Search
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search across all topics, subjects, units, branches, and academic keywords.
        </p>

        {/* Search Box */}
        <div className="relative max-w-2xl mx-auto pt-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7" />
          <input
            type="text"
            autoFocus
            placeholder="Search e.g. 'Binary Search', 'Recursion', 'CSE', 'Dijkstra'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none shadow-xl"
          />
        </div>
      </div>

      {/* Search Results */}
      {query.trim().length > 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Found {searchResults.length} matching topics for "{query}"</span>
          </div>

          <div className="space-y-3">
            {searchResults.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-400 transition-all cursor-pointer flex items-center justify-between"
                onClick={() => onSelectTopic(item.subject, item.unit, item.topic)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      {item.subject.yearId} Year • {item.subject.branchId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.subject.subjectName} ({item.subject.subjectCode})</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {item.topic.name}
                  </h4>
                  <p className="text-xs text-slate-400">{item.unit.title}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                  <span>Open Topic</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}

            {searchResults.length === 0 && (
              <div className="p-12 text-center rounded-2xl glass-card text-slate-500 space-y-2">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">No matching study topics found</p>
                <p className="text-xs">Try searching for keywords like "Data Structures", "QuickSort", "Tree", or "Dijkstra".</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
