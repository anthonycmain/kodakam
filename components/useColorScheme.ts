// Force light mode by always returning 'light'
export function useColorScheme() {
  return 'light' as const;
}
