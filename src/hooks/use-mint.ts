import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export const useMint = () => {
    const { get, post } = useApi();

    const {
        data: collectionData,
        isLoading: isCollectionDataLoading,
    } = useQuery({
        queryKey: ['getCollectionData'],
        queryFn: async () => {
            try {
                const response = (await get(
                    `/nft/get-collection-data`,
                ));
                return response as CollectionDataResponse;

            } catch {
                return undefined;
            }
        },
        retry: 0,
    });

    const {
        data: mintProgress,
        isLoading: isMintProgressLoading,
    } = useQuery({
        queryKey: ['isMinted'],
        queryFn: async () => {
            try {
                const response = (await get(
                    `/nft/get-mint-progress`,
                ));
                return response as MintProgresstResponse;

            } catch {
                return undefined;
            }
        },
        retry: 0,
    });
    
    const mint = async (transactionHash: string) => {
        if (mintProgress?.isEarlyAccessMinted) {
            return;
        }
        const response = await post(`/nft/mint_in_collection/${transactionHash}`);
        return response;
    };

    return {
        mint,
        mintProgress,
        isMintProgressLoading,

        collectionData,
        isCollectionDataLoading,
    };
}

interface MintProgresstResponse {
    totalSupply: number,
    mintedCount: number,
    availableMintCount: number,
    progress: number,
    isEarlyAccessMinted: boolean,
}

interface CollectionDataResponse {
    mintAmount: bigint,
    nextItemIndex: number,
    address: string,
    collectionContent: string,
    owner: string,
    royaltyParams: {
        royalty_factor: number,
        royalty_base: number,
        royalty_address: string,
    },
}