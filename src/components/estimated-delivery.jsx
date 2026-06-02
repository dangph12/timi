import { Info, ShoppingBag, Package } from 'lucide-react';

export default function EstimatedDelivery() {
  return (
    <div className="relative border-[1.5px] border-[#0B57D0] bg-[#E1F2FA] rounded-lg p-3 flex flex-col md:flex-row items-center w-full shadow-sm">
      <div className="absolute top-2 right-2 text-[#0B57D0] cursor-pointer">
        <Info size={18} strokeWidth={2} />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mb-4 md:mb-0 md:mr-4 pl-1">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M20 37.5L3.33333 27.5V11.6667L20 2.5L36.6667 11.6667V27.5L20 37.5Z" fill="white" stroke="#232323" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M20 37.5L36.6667 27.5V11.6667L20 21.6667V37.5Z" fill="#F0F4F8" stroke="#232323" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3.33333 11.6667L20 21.6667L36.6667 11.6667" stroke="#232323" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M20 21.6667V37.5" stroke="#232323" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3.33333 11.6667V27.5L20 37.5V21.6667L3.33333 11.6667Z" fill="#0B57D0" stroke="#232323" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M8.33333 15L15 19M20 21.6667V29" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        <div className="flex flex-col">
          <span className="text-gray-800 text-[13px] font-medium leading-tight">Estimated Delivery</span>
          <span className="font-black text-[22px] leading-tight mt-0.5">JUN 5-8</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-1 w-full md:px-2">
        <div className="flex flex-col items-center w-[80px]">
          <ShoppingBag className="w-[22px] h-[22px] mb-1.5 text-gray-800" strokeWidth={1.5} />
          <div className="font-black text-[13px] leading-none mb-1">MAY 21</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Order placed</div>
        </div>

        <div className="w-4 md:w-8 h-[1.5px] bg-gray-400 rounded-full mb-6 shrink-0"></div>

        <div className="flex flex-col items-center w-[100px]">
          <div className="w-[22px] h-[22px] border-[3px] border-gray-400 rounded-full flex items-center justify-center mb-1.5">
            <div className="w-[9px] h-[9px] bg-gray-400 rounded-full"></div>
          </div>
          <div className="font-black text-[13px] leading-none mb-1">JUN 2-4</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Making your items</div>
        </div>

        <div className="w-4 md:w-8 h-[1.5px] bg-gray-400 rounded-full mb-6 shrink-0"></div>

        <div className="flex flex-col items-center w-[80px]">
          <Package className="w-[22px] h-[22px] mb-1.5 text-gray-800" strokeWidth={1.5} />
          <div className="font-black text-[13px] leading-none mb-1">JUN 5-8</div>
          <div className="text-[11px] text-gray-800 leading-tight text-center">Delivered!</div>
        </div>
      </div>
    </div>
  );
}
