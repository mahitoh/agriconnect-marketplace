import React from 'react';
import { Award, Sprout, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const FarmerSidebar = ({ farmer }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Stats Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[var(--border-light)]">
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
          Farmer Stats
        </h3>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)] mb-1">
              <Award size={14} className="shrink-0" /> Experience
            </div>
            <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {farmer.yearsExperience ?? '—'} years
            </div>
          </div>
          <div className="h-px bg-[var(--border-light)]" />
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)] mb-1">
              <Sprout size={14} className="shrink-0" /> Products
            </div>
            <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {farmer.totalProducts ?? 0}
            </div>
          </div>
          <div className="h-px bg-[var(--border-light)]" />
          {farmer.responseTime && (
            <>
              <div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)] mb-1">
                  <Clock size={14} className="shrink-0" /> Response Time
                </div>
                <div className="text-base sm:text-lg font-bold text-[var(--success)]">
                  {farmer.responseTime}
                </div>
              </div>
              <div className="h-px bg-[var(--border-light)]" />
            </>
          )}
          <div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1">Member Since</div>
            <div className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
              {farmer.memberSince ?? '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {farmer.certifications && farmer.certifications.length > 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[var(--border-light)]">
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            Certifications
          </h3>
          <div className="flex flex-col gap-2.5">
            {farmer.certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[var(--primary-600)]">
                <CheckCircle size={14} className="shrink-0" />
                <span className="truncate">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badge */}
      <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] rounded-xl p-4 sm:p-6 text-white text-center flex flex-col items-center">
        <ShieldCheck size={28} className="sm:w-8 sm:h-8 mb-2 shrink-0" />
        <div className="text-xs sm:text-sm font-bold mb-1">Verified Farmer</div>
        <div className="text-[10px] sm:text-xs opacity-90">Identity & farm verified by AgriConnect</div>
      </div>
    </div>
  );
};

export default FarmerSidebar;
