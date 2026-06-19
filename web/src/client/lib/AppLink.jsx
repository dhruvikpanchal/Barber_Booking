import NextLink from "next/link";

/**
 * App-wide Link wrapper. Disables route prefetch by default to avoid Chrome
 * warnings about preloaded CSS chunks that are not used immediately.
 */
export default function AppLink({ prefetch = false, ...props }) {
  return <NextLink prefetch={prefetch} {...props} />;
}
