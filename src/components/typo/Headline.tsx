import cn from "classnames";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export const Headline = ({ children, className }: Props) => (
  <h1 className={cn("font-bold text-2xl", className)}>{children}</h1>
);
