"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

interface ExportDropdownProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  label?: string;
}

export default function ExportDropdown({
  onExportCSV,
  onExportPDF,
  label = "Export",
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <button
            onClick={() => {
              onExportCSV();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-medium">Export CSV</p>
              <p className="text-xs text-slate-400">Download as spreadsheet</p>
            </div>
          </button>

          <button
            onClick={() => {
              onExportPDF();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-t border-slate-800"
          >
            <FileText className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium">Export PDF</p>
              <p className="text-xs text-slate-400">Download as document</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
