interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-gray-200 border-t-primary-600 ${sizeClasses[size]} ${className}`}></div>
  )
}

















