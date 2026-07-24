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
      className="p-3 bg-white text-gray-900 border-2 border-gray-800 rounded max-w-[320px] w-full mx-auto shadow-md font-sans text-xs relative"
      style={{ fontFamily: "var(--font-family)" }}
    >
      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="text-[#7A001E] font-black text-xs sm:text-sm uppercase tracking-tight break-words leading-tight">
          {settings.marriageTitle || 'சுப மொய் விருந்து'}
        </div>
        {host1 && (
          <div className="text-[11px] font-bold text-gray-800 mt-0.5 break-words">
            {host1}{host2 ? ` & ${host2}` : ''}
          </div>
        )}
        {settings.venue && (
          <div className="text-[10px] text-gray-600 font-medium mt-0.5 break-words">
            இடம்: {settings.venue}
          </div>
        )}
      </div>

      {/* Receipt Info */}
      <div className="flex justify-between items-center text-[10px] font-mono border-b border-dashed border-gray-400 pb-1.5 mb-2 text-gray-700">
        <div>
          <span className="font-bold"># {entry.receiptNo}</span>
        </div>
        <div className="text-right">
          <span>{formatDisplayDate(entry.date)} {entry.time}</span>
        </div>
      </div>

      {/* Guest Details */}
      <div className="space-y-1.5 text-[11px] border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="flex justify-between items-start gap-1">
          <span className="font-semibold text-gray-600 flex-shrink-0">பெயர் (Guest):</span>
          <span className="font-extrabold text-gray-900 text-right">{entry.name}</span>
        </div>

        <div className="flex justify-between items-start gap-1">
          <span className="font-semibold text-gray-600 flex-shrink-0">ஊர் (Address):</span>
          <span className="font-bold text-gray-800 text-right">{entry.address}</span>
        </div>

        {entry.mobile && (
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="font-mono font-bold">{entry.mobile}</span>
          </div>
        )}

        {entry.remarks && (
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-semibold text-gray-600">Remarks:</span>
            <span className="font-medium text-gray-700">{entry.remarks}</span>
          </div>
        )}
      </div>

      {/* Amount Box (ATM Receipt Highlight) */}
      <div className="bg-[#7A001E] text-white p-2 rounded text-center mb-2">
        <div className="text-[9px] font-bold uppercase tracking-wider text-yellow-200">
          MOI AMOUNT (மொய் தொகை)
        </div>
        <div className="text-xl font-black font-mono tracking-tight text-yellow-300 mt-0.5">
          {formatIndianCurrency(entry.amount)}
        </div>
        <div className="text-[9px] italic text-gray-200 mt-0.5">
          ({numberToWords(entry.amount)})
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-gray-600 pt-1">
        <p className="font-bold text-[#7A001E]">{settings.printFooter || 'நன்றி! தங்களின் வருகைக்கு எங்கள் நன்றிகள்!'}</p>
        <div className="mt-2 flex justify-between items-center text-[8px] text-gray-400 font-mono">
          <span>POS Receipt</span>
          <span>Sig: ____________</span>
        </div>
      </div>
    </div>
  );
};
