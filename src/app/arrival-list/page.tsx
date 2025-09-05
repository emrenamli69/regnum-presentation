'use client'

import { useState, useRef } from 'react'
import { TopBar } from "./components/top-bar"
import { TopCards } from "./components/top-cards"
import { AIInsights } from "./components/ai-insights"
import { RepeatGuests } from "./components/repeat-guests"
import { ArrivingGuests } from "./components/arriving-guests"

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const pdfContentRef = useRef<HTMLDivElement>(null)

  const exportToPDF = async () => {
    if (!pdfContentRef.current) return;

    // Dynamically import html2pdf only on client side
    const html2pdf = (await import('html2pdf.js')).default;

    const element = pdfContentRef.current;
    element.classList.add('exporting-pdf');

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'arrival-list-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      element.classList.remove('exporting-pdf');
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content, #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        .exporting-pdf .hide-in-pdf {
          display: none !important;
        }
        .show-in-pdf {
          display: none;
        }
        .exporting-pdf .show-in-pdf {
          display: block !important;
        }
        .exporting-pdf {
          font-size: 12px;
          line-height: 1.5;
        }
        .exporting-pdf .container {
          width: 100%;
          max-width: none;
          padding: 0;
          margin: 0;
        }
        .exporting-pdf .pdf-header {
          margin-bottom: 20px;
        }
        .exporting-pdf h1 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .exporting-pdf h2 {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .exporting-pdf p {
          margin-bottom: 5px;
        }
        .exporting-pdf .space-y-6 > * + * {
          margin-top: 15px;
        }
      `}</style>
      <div id="pdf-content" className="flex flex-col min-h-screen" ref={pdfContentRef}>
        <TopBar date={date} setDate={setDate} onExportPDF={exportToPDF} />
        <main className="flex-grow">
          <div className="container mx-auto p-4 space-y-6">
            <TopCards />
            <AIInsights />
            <RepeatGuests />
            <ArrivingGuests />
          </div>
        </main>
      </div>
    </>
  );
}