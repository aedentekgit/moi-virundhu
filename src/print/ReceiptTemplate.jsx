import React from 'react';
import { formatIndianCurrency } from '../utils/currencyFormatter';
import { numberToWords } from '../utils/numberToWords';
import { formatDisplayDate } from '../utils/dateUtils';
import { FUNCTION_TYPES } from '../utils/storage';

export const ReceiptTemplate = ({ entry, settings }) => {
  if (!entry) return null;

  const currentFuncConfig = FUNCTION_TYPES.find((f) => f.id === settings.functionType) || FUNCTION_TYPES[0];
  const host1 = settings.hostName1 || settings.brideName;
  const host2 = settings.hostName2 || settings.groomName;

  return (
    <div
      id="printable-receipt-area"
      className="p-6 bg-white text-gray-900 border-4 border-[#7A001E] rounded-lg max-w-lg mx-auto shadow-xl font-sans relative"
      style={{ fontFamily: "var(--font-family)" }}
    >
      {/* Outer Decorative Border */}
      <div className="border border-[#D4AF37] p-4 rounded">
        {/* Header */}
        <div className="text-center border-b-2 border-[#7A001E] pb-3 mb-4">
          <div className="text-[#7A001E] font-extrabold text-lg uppercase tracking-wide">
            {settings.marriageTitle || 'சுப மொய் விருந்து'}
          </div>
          <div className="text-sm font-bold text-gray-800 mt-1">
            {currentFuncConfig.h1}: <span className="text-[#7A001E]">{host1}</span>
            {host2 && (
              <> &nbsp;|&nbsp; {currentFuncConfig.h2}: <span className="text-[#7A001E]">{host2}</span></>
            )}
          </div>
          <div className="text-xs text-gray-600 font-medium mt-1">
            இடம்: {settings.venue}
          </div>
        </div>

        {/* Receipt Details Box */}
        <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded border border-amber-200 text-xs font-mono mb-4">
          <div>
            <span className="text-gray-500 font-bold">RECEIPT NO:</span>{' '}
            <strong className="text-[#7A001E] text-sm">{entry.receiptNo}</strong>
          </div>
          <div className="text-right">
            <div><strong>Date:</strong> {formatDisplayDate(entry.date)}</div>
            <div><strong>Time:</strong> {entry.time}</div>
          </div>
        </div>

        {/* Main Guest Info */}
        <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between">
            <span className="font-bold text-gray-600">Guest Name (பெயர்):</span>
            <span className="font-extrabold text-gray-900 text-base">{entry.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-gray-600">Address / Oor (முகவரி):</span>
            <span className="font-semibold text-gray-800">{entry.address}</span>
          </div>

          {entry.mobile && (
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-600">Mobile Number:</span>
              <span className="font-mono">{entry.mobile}</span>
            </div>
          )}

          {entry.remarks && (
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-600">Remarks:</span>
              <span>{entry.remarks}</span>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="bg-[#7A001E] text-yellow-300 p-3 rounded-md text-center shadow-inner mb-4">
          <div className="text-xs font-bold tracking-wider uppercase text-yellow-100">
            Moi Amount Received (மொய் தொகை)
          </div>
          <div className="text-2xl font-black font-mono tracking-tight mt-0.5">
            {formatIndianCurrency(entry.amount)}
          </div>
          <div className="text-xs italic text-yellow-100 mt-1 font-serif">
            ({numberToWords(entry.amount)})
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 pt-2">
          <p className="font-semibold text-[#7A001E]">{settings.printFooter || 'நன்றி! தங்களின் வருகைக்கு எங்கள் மனமார்ந்த நன்றிகள்!'}</p>
          <div className="mt-4 flex justify-between items-end text-[10px] text-gray-400 font-mono">
            <span>System Generated POS Receipt</span>
            <span>Signature: __________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
