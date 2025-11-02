export function LazyVideo({
    src,
    className,
    style,
    poster,
}: {
    src?: string
    className?: string
    style?: React.CSSProperties
    poster?: string
}) {
    // Basic implementation of LazyVideo, you might want to enhance this
    return (
        <video
            src={src}
            className={className}
            style={style}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
        />
    )
}