import error from '@/assets/error.webp'
import { Link } from 'react-router'

export default function ErrorElement() {
    return (
        <div className='min-h-screen flex items-center text-sm px-8 md:text-base justify-center text-center flex-col'>
            <img src={error} alt="errr_image" className='size-[350px]' />
            <p className='font-bold'>Whoops!</p>
            <p className='max-w-md mx-auto mb-5 text-sm'>Something went wrong displaying this page. Please try again later.</p>
            <Link to='/' className='transition duration-300 rounded-full font-medium hover:text-brand'>
                &larr; Go Back
            </Link>
        </div>
    )
}
