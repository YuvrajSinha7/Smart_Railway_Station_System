import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 page-transition">
      <div className="glass-card !border-white/5 overflow-hidden relative">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-48 skeleton" />
              <div className="h-3 w-32 skeleton" />
            </div>
            <div className="h-8 w-8 rounded-full skeleton" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 skeleton" />
            <div className="h-16 skeleton" />
            <div className="h-16 skeleton" />
          </div>

          <div className="space-y-4 pt-2 border-t border-white/5">
            <div className="h-3 w-20 skeleton" />
            <div className="flex gap-2">
              <div className="h-8 w-24 skeleton" />
              <div className="h-8 w-24 skeleton" />
              <div className="h-8 w-24 skeleton" />
            </div>
          </div>

          <div className="h-12 w-full skeleton opacity-40" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="h-8 w-40 rounded-full skeleton" />
      </div>
    </div>
  );
}
