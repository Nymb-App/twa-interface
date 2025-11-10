import React, { Children, cloneElement, isValidElement } from "react";
import { cn } from "@/utils";

// =============== List ===============
type NumberedListProps = {
    children: React.ReactNode;
    className?: string;
    showLine?: boolean; // пунктир между элементами
};

export function NumberedList({ children, className, showLine = true }: NumberedListProps) {
    const items = Children.toArray(children).filter(Boolean);
    return (
        <div className={className}>
            {items.map((child, i) =>
                isValidElement(child)
                    ? cloneElement(child, {
                        // @ts-ignore — пробрасываем служебные пропы внутрь Item
                        __number: i + 1,
                        __isLast: i === items.length - 1,
                        __showLine: showLine,
                    })
                    : child
            )}
        </div>
    );
}

// =============== Item ===============
type NumberedItemProps = {
    children: React.ReactNode;
    className?: string;
    // Слот под любой кастомный компонент справа (кнопка, инпут, селектор и т.д.)
    action?: React.ReactNode;
    // Ведущий икон-слот (слева от заголовка внутри карточки)
    leading?: React.ReactNode;

    // служебные (ставятся NumberedList'ом)
    __number?: number;
    __isLast?: boolean;
    __showLine?: boolean;
};

export function NumberedItem({
    children,
    className,
    leading,
    __number = 1,
    __isLast = false,
}: NumberedItemProps) {
    return (
        <div className="relative inline-flex gap-5">
            {/* Левая колонка: номер + вертикальная пунктирная линия */}
            <div className="flex flex-col items-center">
                <div className="rounded-sm px-1 text-3xl font-pixel text-[#FFD930] tracking-widest">
                    {String(__number).padStart(2, "0")}
                </div>
                {!__isLast && (
                    <hr className="mt-3 h-full border-r-2 border-dashed border-white/20" />
                )}
            </div>

            {/* Карточка */}
            <div
                className={cn(
                    " text-white",
                    className,
                )}
            >
                <div className="flex items-start gap-3">
                    {leading && <div className="shrink-0">{leading}</div>}

                    <div className="min-w-0 flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============== Subcomponents: Title / Description ===============
type TitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

NumberedItem.Title = function Title({ className, ...rest }: TitleProps) {
    return (
        <h3
            className={["text-base font-semibold leading-tight", className || ""].join(" ")}
            {...rest}
        />
    );
};

NumberedItem.Description = function Description({ className, ...rest }: DescriptionProps) {
    return (
        <p
            className={["mt-1 text-sm text-white/70 leading-snug", className || ""].join(" ")}
            {...rest}
        />
    );
};