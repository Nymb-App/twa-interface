// import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './telegram';

const queryClient = new QueryClient();
export const Provider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // useEffect(() => {
    //     if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    //         import('vconsole').then((VConsoleModule) => {
    //             const VConsole = VConsoleModule.default;
    //             new VConsole();
    //         });
    //     }
    // }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TelegramProvider>
                {children}
            </TelegramProvider>
        </QueryClientProvider>
    );
};
