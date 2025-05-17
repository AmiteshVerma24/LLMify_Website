import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "default" | "violet"
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  color = "violet",
  className = ""
}: LoadingSpinnerProps) {
  // Size mapping
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }
  
  // Color mapping
  const colorClasses = {
    default: "text-zinc-400",
    violet: "text-violet-500"
  }
  
  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`} 
    />
  )
}

export function LoadingSpinnerFullPage({ 
  size = "md", 
  color = "violet",
  message
}: LoadingSpinnerProps & { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <LoadingSpinner size={size} color={color} />
      {message && (
        <p className="mt-4 text-zinc-400 text-sm">{message}</p>
      )}
    </div>
  )
}