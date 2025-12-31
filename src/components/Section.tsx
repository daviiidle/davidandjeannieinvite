import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  beforeInner?: ReactNode;
  afterInner?: ReactNode;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  maxWidth?: number | string;
};

const combine = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    children,
    className,
    beforeInner,
    afterInner,
    innerClassName,
    innerStyle,
    maxWidth = '720px',
    style,
    ...rest
  },
  ref,
) {
  const resolvedMaxWidth =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <section
      ref={ref}
      className={combine('app-section', className)}
      style={style}
      {...rest}
    >
      {beforeInner}
      <div
        className={combine('app-section__inner', innerClassName)}
        style={{ maxWidth: resolvedMaxWidth, ...innerStyle }}
      >
        {children}
      </div>
      {afterInner}
    </section>
  );
});
