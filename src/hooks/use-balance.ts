import { useTonAddress } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import TonWeb from 'tonweb';


const apiKey = '500d5f18a2d043083498831e72f2ae65d81428990fb622c64f5d661e14f4bcbc';
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey,
}));

export const useBalance = () => {
    const address = useTonAddress();
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!address) return;

        (async () => {
            setLoading(true);
            try {
                const balance = await tonweb.provider.getBalance(address);      
                if (balance !== undefined) {
                    setBalance(balance / 1e9);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [address]);

    return { balance, isLoading, isError };
}