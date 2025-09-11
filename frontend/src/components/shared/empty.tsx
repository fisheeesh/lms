import cat from '@/assets/lottie/cat.json';
import Lottie from "lottie-react";

export default function Empty({ label, classesName = "w-[200px] h-[150px] lg:h-[200px]" }: { label: string, classesName?: string }) {
    return (
        <>
            <Lottie
                className={classesName}
                animationData={cat}
                loop={true}
                autoplay={true}
            />
            <p className='font-medium'>{label}</p>
        </>
    );
}
