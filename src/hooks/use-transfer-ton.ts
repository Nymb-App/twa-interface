import { useEffect, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell, Cell } from 'ton-core';


function encodeJsonPayload(data: Record<string, any>) {
    const json = JSON.stringify(data);
    const bytes = Buffer.from(json, 'utf-8');

    return beginCell()
        .storeBuffer(bytes)
        .endCell();
}

export const useTransferTon = () => {
    const NANO = 1e9;
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [isSuccess, setSuccess] = useState<boolean>(false);

    const [hash, setHash] = useState<string | undefined>();
    const [isTransactionLoading, setTransactionLoading] = useState<boolean>(false);
    const [isTransactionSuccess, setTransactionSuccess] = useState<boolean>(false);
    const [isTransactionError, setTransactionError] = useState<boolean>(false);

    const transfer = async (
        to: string,
        amount: number,
        comment?: string
    ) => {
        if (!address) {
            open();
            return
        }

        setLoading(true);
        setError(false);
        setSuccess(false);
        try {
            const body = comment === undefined ? undefined : encodeJsonPayload({ comment });

            const { boc } = await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 3600,
                messages: [
                    {
                        address: to,
                        amount: BigInt((amount * NANO).toFixed()).toString(),
                        payload: body?.toBoc().toString('base64'),
                    },
                ]
            });

            // Parse the response to get the transaction ID
            const cell = Cell.fromBase64(boc);
            const transactionHash = cell.hash().toString('hex');

            setSuccess(true);
            setLoading(false);
            setHash(transactionHash);
            return transactionHash;
        } catch (error) {
            setError(true);
            setLoading(false);
            console.error("Error during transfer:", error);
        }
    };


    // Check transaction status
    // This is a placeholder for the actual API call to check the transaction status
    useEffect(() => {
        if (!isSuccess || !hash) {
            return;
        }
        setTransactionError(false);
        setTransactionSuccess(false);
        setTransactionLoading(true);

        let attemptCount = 0;
        const maxAttempts = 50;
        const interval = 1500;

        const poll = async () => {
            attemptCount++;
            if (attemptCount > maxAttempts) {
                setTransactionError(true);
                clearInterval(timer);
                return;
            }

            try {
                const res = await fetch(
                    `https://tonapi.io/v2/blockchain/transactions/${hash}`,
                    { headers: { accept: 'application/json' } }
                )

                // >=400 = "Not Found" - wait untill transaction is mined
                // res.ok = false - wait untill transaction is mined
                if (
                    res.status >= 400 ||
                    res.ok === false
                ) {
                    return;
                }

                const dataText = await res.text();

                if (!dataText) {
                    return;
                }

                const transaction = JSON.parse(dataText);

                if (transaction.success === true) {
                    setTransactionSuccess(true);
                    setTransactionLoading(false);
                    clearInterval(timer);
                }
            } catch (err) {
                setTransactionError(true);
                setTransactionLoading(false);
                clearInterval(timer);
            }
        }

        poll();
        const timer = setInterval(poll, interval);

        return () => {
            clearInterval(timer);
            attemptCount = 0;
        }
    }, [isSuccess, hash])


    return {
        transfer,
        isLoading,
        isError,
        isSuccess,

        hash,
        isTransactionSuccess,
        isTransactionError,
        isTransactionLoading,
    };
}