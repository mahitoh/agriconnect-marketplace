import React from 'react';

// Base skeleton pulse element
const Skeleton = ({ className = '', style = {} }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={style}
  />
);

// ─── Product Card Skeleton ───────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-[var(--border-light)] h-full flex flex-col">
    {/* Image placeholder */}
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="p-4 flex flex-col gap-3 flex-1">
      {/* Category badge */}
      <Skeleton className="h-5 w-20 rounded-full" />
      {/* Product name */}
      <Skeleton className="h-5 w-3/4" />
      {/* Location */}
      <Skeleton className="h-4 w-1/2" />
      {/* Price + button row */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Product Grid Skeleton ───────────────────────────────────
export const ProductGridSkeleton = ({ count = 6, viewMode = 'grid' }) => (
  <div className={`${viewMode === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 gap-6'
  }`}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Farmer Card Skeleton ────────────────────────────────────
export const FarmerCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-[var(--border-light)] h-full flex flex-col">
    {/* Image */}
    <Skeleton className="h-64 w-full rounded-none" />
    <div className="p-5 flex flex-col gap-3 flex-1">
      {/* Name */}
      <Skeleton className="h-6 w-3/5" />
      {/* Farm name */}
      <Skeleton className="h-4 w-2/3" />
      {/* Location */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Stats row */}
      <div className="flex items-center gap-4 mt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Button */}
      <Skeleton className="h-10 w-full rounded-xl mt-auto" />
    </div>
  </div>
);

// ─── Farmer Grid Skeleton ────────────────────────────────────
export const FarmerGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <FarmerCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Farmer Profile Skeleton ─────────────────────────────────
export const FarmerProfileSkeleton = () => (
  <div className="min-h-screen bg-[var(--bg-secondary)]">
    {/* Cover image */}
    <Skeleton className="w-full h-64 md:h-80 rounded-none" />
    <div className="max-w-7xl mx-auto px-6 -mt-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6 space-y-4">
            <Skeleton className="w-28 h-28 rounded-full mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Table Skeleton ──────────────────────────────────────────
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="space-y-3">
    {/* Header row */}
    <div className="flex gap-4 pb-3 border-b border-[var(--border-light)]">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Data rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-3">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// ─── Orders List Skeleton ────────────────────────────────────
export const OrdersListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-light)]">
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-5 w-24 ml-auto" />
          <Skeleton className="h-6 w-20 rounded-full ml-auto" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Activity Feed Skeleton ──────────────────────────────────
export const ActivityFeedSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-light)]">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Stats Card Skeleton ─────────────────────────────────────
export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-8 w-28" />
    <Skeleton className="h-4 w-20" />
  </div>
);

// ─── Dashboard Overview Skeleton ─────────────────────────────
export const DashboardOverviewSkeleton = () => (
  <div className="space-y-8">
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    {/* Content area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <ActivityFeedSkeleton count={4} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)] last:border-0">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Inventory Skeleton ──────────────────────────────────────
export const InventorySkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded-xl">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Notifications Skeleton ──────────────────────────────────
export const NotificationsSkeleton = ({ count = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-light)]">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Profile Skeleton ────────────────────────────────────────
export const ProfileFormSkeleton = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] overflow-hidden">
    {/* Banner */}
    <Skeleton className="h-48 w-full rounded-none" />
    {/* Avatar */}
    <div className="px-6 -mt-14 mb-4">
      <Skeleton className="w-28 h-28 rounded-full border-4 border-white" />
    </div>
    <div className="px-6 pb-8 space-y-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

// ─── User Details Modal Skeleton ─────────────────────────────
export const UserDetailsSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-[var(--border-light)]">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-5 w-36" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
