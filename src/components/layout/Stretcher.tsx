type Props = {
  children?: React.ReactNode | React.ReactNode[];
  id?: string;
};

export const Stretcher = ({ children, id }: Props) => {
  return (
    <div className="flex min-h-screen" id={id}>
      {children}
    </div>
  );
};
