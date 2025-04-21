'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            position="top-center"
            toastOptions={{
                classNames: {
                    error: '!bg-danger !text-white',
                    success: '!bg-success !text-white',
                    warning: '!bg-warning !text-white',
                    info: '!bg-approved !text-white',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };