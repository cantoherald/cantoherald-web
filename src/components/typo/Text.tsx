import cn from "classnames";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export const Text = ({ children, className }: Props) => (
  <h1 className={cn(className)}>{children}</h1>
);
