import { cn } from '@/lib/utils'
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarGroup as AvatarGroupRoot,
  AvatarGroupCount,
} from '@/components/ui/avatar'

const sizeMap = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
}

export function Avatar({ size = 'md', initials, src, color, textColor, alt = '' }) {
  return (
    <AvatarRoot className={sizeMap[size]}>
      {src
        ? <AvatarImage src={src} alt={alt} />
        : <AvatarFallback
            style={color ? { background: color, color: textColor } : undefined}
          >
            {initials}
          </AvatarFallback>
      }
    </AvatarRoot>
  )
}

export function AvatarGroup({ avatars = [], max = 4, size = 'md' }) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <AvatarGroupRoot>
      {visible.map((a, i) => (
        <Avatar key={i} size={size} {...a} />
      ))}
      {overflow > 0 && (
        <AvatarGroupCount className={sizeMap[size]}>
          +{overflow}
        </AvatarGroupCount>
      )}
    </AvatarGroupRoot>
  )
}
