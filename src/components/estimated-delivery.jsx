import { Info } from 'lucide-react';

export default function EstimatedDelivery() {
  return (
    <div className="relative border-[2px] border-[#0B57D0] bg-[#E1F2FA] rounded-lg p-3 flex flex-col md:flex-row items-center w-full shadow-sm">
      <div className="absolute top-2 right-2 text-[#0B57D0] cursor-pointer">
        <Info size={18} strokeWidth={2} />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mb-4 md:mb-0 md:mr-4 pl-1">
        <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M24 24L42 14V34L24 44V24Z" fill="#E2E8F0" stroke="#1c1c1c" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M6 14L24 24V44L6 34V14Z" fill="#0b57d0" stroke="#1c1c1c" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M24 4L42 14L24 24L6 14L24 4Z" fill="#F8FAFC" stroke="#1c1c1c" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M14 9.5L34 20" stroke="#1c1c1c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M34 20V26" stroke="#1c1c1c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>

        <div className="flex flex-col">
          <span className="text-gray-800 text-[13px] font-medium leading-tight">Estimated Delivery</span>
          <span className="font-black text-[22px] leading-tight mt-0.5">JUN 5-8</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-1 w-full md:px-2">
        <div className="flex flex-col items-center w-[80px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5 shrink-0">
            <rect x="3.5" y="4.5" width="17" height="16" rx="0.5" />
            <path d="M8 10.5a4 4 0 0 0 8 0" />
          </svg>
          <div className="font-black text-[13px] leading-none mb-1">MAY 21</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Order placed</div>
        </div>

        <div className="w-4 md:w-8 h-[1.5px] bg-gray-400 rounded-full mb-6 shrink-0"></div>

        <div className="flex flex-col items-center w-[100px]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1 shrink-0">
            <circle cx="12" cy="12" r="8" stroke="#4B5563" strokeWidth="4.5" strokeDasharray="2.5 3.5" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#4B5563" strokeWidth="1.5" />
          </svg>
          <div className="font-black text-[13px] leading-none mb-1">JUN 2-4</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Making your items</div>
        </div>

        <div className="w-4 md:w-8 h-[1.5px] bg-gray-400 rounded-full mb-6 shrink-0"></div>

        <div className="flex flex-col items-center w-[80px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5 shrink-0">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <div className="font-black text-[13px] leading-none mb-1">JUN 5-8</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Delivered!</div>
        </div>
      </div>
    </div>
  );
}
