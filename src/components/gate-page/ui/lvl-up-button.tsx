import { cn } from '@/lib/utils';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { CloseIcon } from '@/assets/icons/close'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { ItemTime } from './item-time';
import { ItemTicket } from './item-ticket';
import { useAccountMe } from '@/hooks/api/use-account';
import { useMemo } from 'react';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { Link } from '@tanstack/react-router';

export function LvlUpButton({ className }: { className?: string }) {
    const { accountQuery } = useAccountMe();

    const accountData = useMemo(() => {
        if (!accountQuery.data) {
            return {
                lvl: 12,
                ticket: 0,
                time: 0,
            }
        }

        const { ticket, time, lvl } = accountQuery.data;

        return {
            ticket,
            time,
            lvl,
        };
    }, [accountQuery.data]);

    const isTicketsEnough = useMemo(() => {
        if (!accountData.ticket) return false;
        if (accountData.ticket === 0) return false;
        return accountData.ticket >= 2;
    }, [accountData.ticket, accountData.lvl]);

    const isTimeEnough = useMemo(() => {
        if (!accountData.time) return false;
        if (accountData.time * 1000 <= Date.now()) return false;
        return accountData.time >= 1;
    }, [accountData.time, accountData.lvl]);

    if (isTicketsEnough && isTimeEnough) {
        return (
            <LvlUpButtonWithNextGateNavigation
                className={className}
            />
        );
    }
    else {
        return (
            <LvlUpButtonWithShop
                ticketAmount={accountData.ticket}
                timeAmount={accountData.time}
                lvl={accountData.lvl}
                className={className}
            />
        )
    }
}


function LvlUpButtonWithShop({
    ticketAmount,
    timeAmount,
    lvl,
    className,
}: {
    ticketAmount?: number,
    timeAmount?: number,
    lvl?: number,
    className?: string,
}) {
    const isTicketsEnough = useMemo(() => {
        if (!ticketAmount) return false;
        if (ticketAmount === 0) return false;
        return ticketAmount >= 2;
    }, [ticketAmount, lvl]);

    const isTimeEnough = useMemo(() => {
        if (!timeAmount) return false;
        if (timeAmount * 1000 <= Date.now()) return false;

        // Получаем количество лет
        const time = parseFloat((timeAmount / 86400 * 365).toFixed(2));
        return time >= 1;
    }, [timeAmount, lvl]);

    return (
        <Drawer>
            <DrawerTrigger
                className={cn(
                    'fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[450px] font-pixel text-white text-xl py-4 border-b-4 border-[#232423] bg-gradient-to-b from-[#414241] to-[#363736] rounded-2xl cursor-pointer outline-none',
                    className,
                )}
            >
                JUMP TO THE NEXT GATE
            </DrawerTrigger>

            <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
                <DrawerClose
                    className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer"
                >
                    <CloseIcon />
                </DrawerClose>
                <DrawerHeader className="text-center">
                    <DrawerTitle className="font-pixel text-white text-2xl">
                        GATE LOCKED
                    </DrawerTitle>
                    <DrawerDescription className="text-white/60 font-inter text-sm">
                        You don&apos;t have enough resources to open<br />the next gate.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="relative inline-flex justify-around items-center w-full mt-6 font-pixel text-white px-10">
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <WatchesIcon className="size-12" />
                        <span className="text-2xl">
                            00
                            <span className="text-white/40 font-inter"> / </span>
                            01
                        </span>
                        <span className="text-white/40 text-xs">YEARS</span>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <TicketIcon className="size-12" />
                        <span className="text-2xl">
                            00
                            <span className="text-white/40 font-inter"> / </span>
                            01
                        </span>
                        <span className="text-white/40 text-xs">TICKETS</span>
                    </div>
                </div>

                <div className="mt-8 w-full inline-flex justify-center">
                    {(!isTimeEnough && isTicketsEnough) && <ItemTime />}
                    {!isTicketsEnough && <ItemTicket />}
                </div>

                <DrawerFooter className="relative mt-6 mb-4">
                    <DrawerClose className="w-full py-4 font-pixel text-black text-xl bg-gradient-to-b from-white to-[#999999] rounded-2xl cursor-pointer">
                        CLOSE
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}


function LvlUpButtonWithNextGateNavigation({
    className,
    lvl,
}: {
    className?: string,
    lvl?: number,
}) {

    const nextLvl = useMemo(() => {
        if (!lvl) return 11;
        return lvl - 1 > 0 ? lvl - 1 : 1;
    }, [lvl]);


    return (
        <Drawer>
            <DrawerTrigger
                className={cn(
                    'fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[450px] font-pixel text-black text-xl py-4 bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] rounded-2xl cursor-pointer outline-none',
                    className,
                )}
            >
                JUMP TO THE NEXT GATE
            </DrawerTrigger>

            <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
                <FlickeringGrid
                    className='absolute -top-14 left-0 size-full mask-[radial-gradient(ellipse_200px_150px_at_center,black,transparent)]'
                    squareSize={2}
                    gridGap={12}
                    color="#b7ff01"
                    maxOpacity={0.9}
                    flickerChance={0.3}
                    autoResize={false}
                />

                <DrawerClose
                    className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer"
                >
                    <CloseIcon />
                </DrawerClose>
                <DrawerHeader className="text-center">
                    <DrawerTitle className="font-pixel text-white text-2xl">
                        OPEN GATE
                    </DrawerTitle>
                </DrawerHeader>

                <div className="relative inline-flex justify-around items-center w-full mt-6 font-pixel text-white px-10">
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <WatchesIcon className="size-12" />
                        <span className="text-2xl">00</span>
                        <span className="text-base">YEARS</span>
                    </div>

                    <div className="flex flex-col gap-1 justify-center items-center rounded-4xl size-[88px] outline-2 outline-[#B6FF00] bg-[#161816] shadow-[0_0_80px_#B6FF00]/60">
                        <span
                            className={cn(
                                "text-3xl text-[#B6FF00]",
                                (nextLvl === 11 || nextLvl === 10 || nextLvl === 1) && "mr-3.5"
                            )}
                        >
                            {nextLvl}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 justify-center items-center">
                        <TicketIcon className="size-12" />
                        <span className="text-2xl">1</span>
                        <span className="text-base">TICKETS</span>
                    </div>
                </div>

                <div className='mt-8'>
                    <h3 className='text-white/60 text-center text-sm'>
                        After opening gate, you'll get:
                    </h3>

                    <div className='grid grid-cols-2 gap-4 mt-6 px-4'>
                        <div className='w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4'>
                            <div className='inline-flex gap-1 justify-center items-baseline'>
                                <span className='text-2xl text-[#B6FF00]'>02</span>
                                <span className='text-sm text-white/40'>DAYS</span>
                            </div>

                            <span className='text-white text-sm font-inter'>Daily reward</span>
                        </div>

                        <div className='w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4'>
                            <div className='inline-flex gap-1 justify-center items-baseline'>
                                <span className='text-2xl text-[#B6FF00]'>08</span>
                                <span className='text-sm text-white/40'>HOURS</span>
                            </div>

                            <span className='text-white text-sm font-inter'>Daily reward</span>
                        </div>

                        <div className='w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4'>
                            <div className='inline-flex gap-1 justify-center items-baseline'>
                                <span className='text-2xl text-[#B6FF00]'>1200</span>
                            </div>

                            <span className='text-white text-sm font-inter'>Max energy</span>
                        </div>

                        <div className='w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4'>
                            <div className='inline-flex gap-1 justify-center items-baseline'>
                                <span className='text-2xl text-[#B6FF00]'>4</span>
                                <span className='text-sm text-white/40'>POINTS</span>
                            </div>

                            <span className='text-white text-sm font-inter'>In Swap</span>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="relative mt-6 mb-4">
                    <Link to={'/unlock-gate'} className="w-full py-4 font-pixel text-black text-xl bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] rounded-2xl cursor-pointer text-center">
                        GO TO {nextLvl} GATE
                    </Link>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}