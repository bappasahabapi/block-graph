// Utility function for conditional classNames (shadcn/ui style)
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
