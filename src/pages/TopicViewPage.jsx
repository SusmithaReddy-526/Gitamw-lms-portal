import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiGenerator } from '../services/aiGenerator';
import { dbService } from '../services/dbService';
import { SvgDiagram } from '../components/common/SvgDiagram';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  Layers, 
  Check, 
  Copy, 
  Award,
  Bookmark
} from 'lucide-react';

export function TopicViewPage({ topic, subject, unit, user, onBack }) {
  const [data, setData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Interactive Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // Check if cached study material exists or generate fresh
    const existing = dbService.getStudyMaterial(topic.id);
    if (existing) {
      setData(existing);
    } else {
      const generated = aiGenerator.generateTopicMaterial(topic.name, subject?.subjectName, unit?.title);
      dbService.saveStudyMaterial(topic.id, generated);
      setData(generated);
    }
  }, [topic, subject, unit]);

  if (!data) {
    return (
      <div className="py-20 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Loading Educational Content...</h3>
        <p className="text-xs text-slate-500">Preparing ~1500 words, SVG diagrams, PYQs, and interactive quiz...</p>
      </div>
    );
  }

  // Copy code helper
  const handleCopyCode = () => {
    if (data.codeExample?.code) {
      navigator.clipboard.writeText(data.codeExample.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // PDF Exporter
  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`GITAMW Autonomous - Official Study Guide`, 14, 20);
    
    doc.setFontSize(14);
    doc.text(`Topic: ${data.topicName}`, 14, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subject: ${data.subjectName} | Unit: ${data.unitName}`, 14, 37);
    doc.text(`Generated: ${data.generatedAt} | Word Count: ${data.wordCount} words`, 14, 43);

    doc.line(14, 48, 196, 48);

    doc.setFont('helvetica', 'bold');
    doc.text('1. Easy Overview:', 14, 56);
    doc.setFont('helvetica', 'normal');
    const easyLines = doc.splitTextToSize(data.easyExplanation.replace(/\*\*/g, ''), 180);
    doc.text(easyLines, 14, 62);

    let yPos = 62 + (easyLines.length * 5) + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('2. Key Definitions:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    data.keyDefinitions.forEach((item) => {
      doc.text(`- ${item.term}: ${item.definition}`, 14, yPos);
      yPos += 6;
    });

    doc.save(`${data.topicName.replace(/[^a-z0-9]/gi, '_')}_StudyGuide.pdf`);
  };

  // Bookmark / Save to Downloads
  const handleBookmark = () => {
    if (user) {
      dbService.saveUserDownload(user.id, {
        topicId: topic.id,
        topicName: topic.name,
        subjectName: subject?.subjectName,
        unitName: unit?.title
      });
      setBookmarked(true);
    }
  };

  // Quiz submission handler
  const handleQuizSubmit = () => {
    let score = 0;
    data.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === data.quiz.length) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              bookmarked
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                : 'glass-card text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
            {bookmarked ? 'Saved to Downloads' : 'Save Offline'}
          </button>

          <button
            onClick={handleExportPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-brand-500 hover:to-indigo-500 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF Notes
          </button>
        </div>
      </div>

      {/* Main Title Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-900 via-navy-900 to-slate-950 text-white shadow-xl relative overflow-hidden border border-brand-500/30 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-400/30">
            {data.subjectName}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {data.unitName}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Notes (~{data.wordCount} words)
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit leading-tight">
          {data.topicName}
        </h1>
        <p className="text-xs text-slate-300">
          Generated for GITAMW Autonomous Curriculum • Updated: {data.generatedAt}
        </p>
      </div>

      {/* 1. Easy & Detailed Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Easy Explanation */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-500" />
              Intuitive Overview & Easy Explanation
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.easyExplanation}
            </p>
          </div>

          {/* Detailed Technical Deep Dive */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Detailed Technical Explanation
            </h3>
            <div className="prose dark:prose-invert text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {data.detailedExplanation}
            </div>
          </div>

          {/* Vector SVG Diagram */}
          <SvgDiagram 
            type={data.diagramSpec?.type} 
            title={data.diagramSpec?.title} 
            caption={data.diagramSpec?.caption} 
          />

          {/* Comparative Matrix Table */}
          {data.comparisonTable && (
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 overflow-x-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                {data.comparisonTable.title}
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50">
                    {data.comparisonTable.headers.map((h, i) => (
                      <th key={i} className="p-3 font-bold text-slate-900 dark:text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Code Implementation */}
          {data.codeExample && (
            <div className="rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-400 font-bold">{data.codeExample.title}</span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Snippet'}
                </button>
              </div>
              <pre className="p-6 text-xs font-mono overflow-x-auto leading-relaxed text-blue-200">
                <code>{data.codeExample.code}</code>
              </pre>
            </div>
          )}

          {/* PYQs & Exam Questions */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Previous Year Questions (PYQs) & Important Exam Questions
            </h3>
            <div className="space-y-3">
              {data.examQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      {q.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Exam Frequency: High</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{q.question}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    <strong>Suggested Answer:</strong> {q.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Key Definitions */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white font-outfit text-base">
              Key Terminology & Definitions
            </h4>
            <div className="space-y-3">
              {data.keyDefinitions.map((def, i) => (
                <div key={i} className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/50 dark:border-brand-800/40 space-y-1">
                  <span className="block font-bold text-xs text-brand-700 dark:text-brand-300">{def.term}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{def.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive MCQ Quiz */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white font-outfit text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-500" />
                Practice MCQ Quiz
              </h4>
              {quizSubmitted && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Score: {quizScore} / {data.quiz.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {data.quiz.map((q, qIdx) => (
                <div key={q.id} className="space-y-2 border-b pb-4 last:border-0 border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Q{qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      const isCorrect = q.correctIndex === oIdx;

                      let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-700 dark:text-slate-300';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold';
                        else if (isSelected && !isCorrect) btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300';
                      } else if (isSelected) {
                        btnStyle = 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: oIdx })}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg mt-1">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(selectedAnswers).length < data.quiz.length}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
              >
                Submit Quiz & Check Score
              </button>
            ) : (
              <button
                onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs shadow transition-all"
              >
                Retake Quiz
              </button>
            )}
          </div>

          {/* Quick Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-950 to-navy-950 text-white border border-brand-800 space-y-3">
            <h4 className="font-bold text-base font-outfit text-brand-300">
              Revision Summary & Cheat Sheet
            </h4>
            <div className="prose text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {data.summary}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
