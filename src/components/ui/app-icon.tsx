import * as React from "react";

import { cn } from "@/lib/utils";

export type AppIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  /**
   * Sets both width and height. Falls back to provided width/height or 1em.
   */
  size?: number | string;
};

function AppIcon({
  className,
  title,
  size,
  width,
  height,
  ...props
}: AppIconProps) {
  const computedWidth = size ?? width ?? "1em";
  const computedHeight = size ?? height ?? "1em";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 54 68"
      width={computedWidth}
      height={computedHeight}
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("text-foreground dark:text-foreground", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M13.5 54.4H40.5V68H0V0H40.5V13.6H13.5V27.2H40.5V40.8H13.5V54.4ZM54 27.2H40.5V13.6H54V27.2ZM54 54.4H40.5V40.8H54V54.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { AppIcon };
export default AppIcon;
