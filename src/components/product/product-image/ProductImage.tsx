import Image from "next/image"

interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    width: number;
    height: number;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
}

export const ProductImage = ({src, alt, className, style, width, height, onMouseEnter, onMouseLeave}: Props) => {

    const localSource = (src) 
        ? src.startsWith('http') 
            ? src 
            : `/products/${src}`
        : '/imgs/placeholder.jpg'
    
    return (
        <Image
            src={localSource}
            width={width}
            height={height}
            alt={alt}
            className={className}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}

        />
    )
}
