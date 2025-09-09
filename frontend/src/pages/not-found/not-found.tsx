import error from '@/assets/error.webp'
import { Link } from 'react-router'

export default function NotFound() {
    return (
        <div className='min-h-screen flex items-center text-sm px-8 md:text-base justify-center text-center flex-col'>
            <img src={error} alt="errr_image" className='size-[350px]' />
            <p className='font-bold'>Sorry!</p>
            <p className='max-w-md mx-auto mb-5 text-sm'>
                The page you are looking for does not exist. <br />
                You may have mistyped the address or the page may have moved.
            </p>
            <Link to='/' className='transition duration-300 rounded-full font-medium hover:text-brand'>
                &larr; Go Back
            </Link>
        </div>
    )
}
