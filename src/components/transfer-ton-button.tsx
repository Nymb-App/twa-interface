import React, { useEffect } from "react";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { useTransferTon } from "@/hooks/use-transfer-ton";
import { cn } from "@/utils";
import { useBalance } from "@/hooks/use-balance";

export type TransferTonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onTransferSuccess?: (hash: string) => void;
    onClick?: () => void;
    onConnect?: () => void;
    onError?: (error: any) => void;
    recipient: string;
    amount: number;
};

export function TransferTonButton({
    onTransferSuccess,
    onError,
    onClick,
    onConnect,
    children,
    recipient,
    amount,
    className,
    ...props
}: TransferTonButtonProps) {
    const address = useTonAddress();
    const { open } = useTonConnectModal();
    const { balance } = useBalance();
    const { transfer, isTransactionLoading, isTransactionError, hash, isTransactionSuccess } = useTransferTon();

    useEffect(() => {
        if(hash && isTransactionSuccess) {
            console.log(hash, isTransactionSuccess);
            onTransferSuccess?.(hash);
        }
    }, [hash, onTransferSuccess, isTransactionSuccess]);

    useEffect(() => {
        if(recipient.toLowerCase() === address.toLowerCase()) {
            onError?.({message: "You can't send to yourself"});
            return;
        }
        if (isTransactionError) {
            onError?.({message: "Error happened due to transfer"});
            return;
        }
    }, [address, isTransactionError, onError]);

    const handleTransfer = async () => {
        onClick?.();
        if (!address) {
            onConnect?.();
            open();
            return;
        }
        if(!balance) {
            return;
        }
        if(balance < amount) {
            onError?.({message: "Insufficient balance"});
            return;
        }

        await transfer(recipient, amount);
    };

    return (
        <button
            className={cn("font-pixel text-lg bg-gradient-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00] text-[#121312] rounded-xl py-4 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed",
                isTransactionLoading && "bg-[#222A10]",
                className
            )}
            onClick={handleTransfer}
            disabled={props.disabled}
            {...props}
        >
            {isTransactionLoading ? (
                <div className="inline-flex justify-center items-center gap-2 mix-blend-difference text-[#B6FF00]">
                    <span>Transferring</span>
                    <span className="flex items-center text-2xl tracking-tight">
                        <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                        <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                        <span className="animate-bounce">.</span>
                    </span>
                </div>
            ) : !address ? (
                'CONNECT WALLET'
            ) : (
                children
            )}
        </button>
    )
}