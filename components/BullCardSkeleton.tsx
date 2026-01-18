import Skeleton from './Skeleton'

export default function BullCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Image placeholder */}
      <div className="relative aspect-square bg-gray-100">
        <Skeleton className="w-full h-full" />
        {/* Status badge placeholder */}
        <div className="absolute top-2 right-2">
          <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="text" height={20} className="w-3/4" />

        {/* Breed and age */}
        <div className="flex justify-between">
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={60} height={16} />
        </div>

        {/* Location */}
        <Skeleton variant="text" width={100} height={16} />

        {/* Price */}
        <Skeleton variant="text" width={70} height={18} className="font-semibold" />

        {/* Action button */}
        <Skeleton variant="rectangular" height={40} className="rounded-lg w-full mt-4" />
      </div>
    </div>
  )
}









