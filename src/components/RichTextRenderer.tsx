import type { PortableTextBlock } from '@portabletext/types';
import type { PortableTextComponents } from '@portabletext/react';
import type { ReactNode } from 'react';
import { PortableText } from '@portabletext/react';
import clsx from 'clsx';

type ChildrenProps = { children?: ReactNode };
type Variant = 'dark' | 'light' | 'mutedDark' | 'mutedLight';

const variantClasses: Record<Variant, {
  paragraph: string;
  h2: string;
  h3: string;
  blockquote: string;
  list: string;
  link: string;
}> = {
  dark: {
    paragraph: 'text-white/80',
    h2: 'text-2xl font-semibold text-white',
    h3: 'text-xl font-semibold text-white',
    blockquote: 'border-l-2 border-accent/60 pl-4 text-white/80',
    list: 'text-white/80',
    link: 'underline decoration-accent decoration-2 underline-offset-4'
  },
  light: {
    paragraph: 'text-slate-700 dark:text-slate-200',
    h2: 'text-2xl font-semibold text-slate-900 dark:text-white',
    h3: 'text-xl font-semibold text-slate-900 dark:text-white',
    blockquote: 'border-l-2 border-slate-300 dark:border-slate-700 pl-4 text-slate-700 dark:text-slate-200',
    list: 'text-slate-700 dark:text-slate-200',
    link: 'text-slate-900 dark:text-slate-100 underline decoration-slate-400 decoration-2 underline-offset-4'
  },
  mutedDark: {
    paragraph: 'text-sm text-white/70',
    h2: 'text-lg font-semibold text-white/90',
    h3: 'text-base font-semibold text-white/90',
    blockquote: 'border-l border-white/30 pl-4 text-white/70',
    list: 'text-sm text-white/70',
    link: 'underline decoration-white/60 decoration-1 underline-offset-4'
  },
  mutedLight: {
    paragraph: 'text-xs md:text-sm text-slate-600/80 dark:text-slate-300/80',
    h2: 'text-base font-semibold text-slate-900 dark:text-white',
    h3: 'text-sm font-semibold text-slate-900 dark:text-white',
    blockquote:
      'border-l border-slate-200 dark:border-slate-700 pl-4 text-xs md:text-sm text-slate-600/80 dark:text-slate-300/80',
    list: 'text-xs md:text-sm text-slate-600/80 dark:text-slate-300/80',
    link: 'text-slate-900/80 dark:text-slate-100/80 underline decoration-slate-400/70 decoration-1 underline-offset-4'
  }
};

const createComponents = (variant: Variant): PortableTextComponents => {
  const palette = variantClasses[variant];
  return {
    block: {
      normal: ({ children }: ChildrenProps) => <p className={palette.paragraph}>{children}</p>,
      h2: ({ children }: ChildrenProps) => <h2 className={palette.h2}>{children}</h2>,
      h3: ({ children }: ChildrenProps) => <h3 className={palette.h3}>{children}</h3>,
      blockquote: ({ children }: ChildrenProps) => (
        <blockquote className={palette.blockquote}>{children}</blockquote>
      )
    },
    marks: {
      link: ({ children, value }: { children: ReactNode; value?: { href?: string } }) => (
        <a
          href={value?.href}
          rel="noreferrer noopener"
          target={value?.href?.startsWith('/') ? '_self' : '_blank'}
          className={palette.link}
        >
          {children}
        </a>
      )
    },
    list: {
      bullet: ({ children }: ChildrenProps) => (
        <ul className={clsx('list-disc space-y-1 pl-6', palette.list)}>{children}</ul>
      ),
      number: ({ children }: ChildrenProps) => (
        <ol className={clsx('list-decimal space-y-1 pl-6', palette.list)}>{children}</ol>
      )
    }
  };
};

type Props = {
  value?: PortableTextBlock[];
  className?: string;
  variant?: Variant;
};

export default function RichTextRenderer({ value, className, variant = 'light' }: Props) {
  if (!value?.length) return null;
  return (
    <div className={clsx('space-y-4 text-base leading-relaxed', className)}>
      <PortableText value={value} components={createComponents(variant)} />
    </div>
  );
}
