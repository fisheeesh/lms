import { ADMINNAVLINKS, APP_NAME, USERNAVLINKS } from '@/lib/constants'
import useFilterStore from '@/store/filter-store'
import useUserStore from '@/store/user-store'
import { useState } from 'react'
import { SiLogseq } from "react-icons/si"
import { NavLink, useNavigate } from 'react-router'
import LogoutModal from '../modals/log-out-modal'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import AuthDropdown from './auth-drop-down'
import CommonFilter from './common-filter'
import { ModeToggle } from './mode-toggle'

export default function Navbar() {
    const [isMobMenuOpen, setIsMobMenuOpen] = useState(false)
    const navigate = useNavigate()
    const { user } = useUserStore()
    const { filters } = useFilterStore()

    const NAVLINKS = user.role === 'ADMIN' ? ADMINNAVLINKS : USERNAVLINKS

    const renderNavLinks = () =>
        NAVLINKS.map((link, index) => (
            <NavLink
                onClick={() => setIsMobMenuOpen(false)}
                key={index}
                to={link.to}
                className={({ isActive }) =>
                    `${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'} text-base block`
                }
            >
                {link.name}
            </NavLink>
        ))

    return (
        <div>
            <nav className='fixed top-0 left-0 right-0 z-50 border-b bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm dark:bg-slate-900/70 dark:border-0 dark:shadow-2xl'>
                <div className="w-full flex justify-between items-center max-w-[1440px] px-4 mx-auto md:h-20 h-16">
                    {/* Logo & Links */}
                    <div className="flex items-center cursor-pointer gap-4" onClick={() => navigate('/')}>
                        <SiLogseq className='size-5' />
                        <h1 className="font-mich tracking-wider text-[10px] md:text-xs dark:bg-gradient-to-r dark:from-purple-400 dark:via-pink-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent">
                            {APP_NAME}
                        </h1>
                    </div>

                    {/* Desktop Right Side */}
                    <div className='hidden md:flex items-center gap-3'>
                        {user.role === 'ADMIN' && <CommonFilter
                            filterValue="gTenant"
                            filters={filters.lTenants}
                            otherClasses="min-h-[40px] sm:min-w-[150px]"
                        />}
                        <ModeToggle />
                        <AuthDropdown />
                    </div>

                    {/* Mobile Hamburger Menu */}
                    <div className="md:hidden flex items-center mt-2">
                        <button
                            onClick={() => setIsMobMenuOpen(!isMobMenuOpen)}
                            className={`hamburger ${isMobMenuOpen ? 'open' : ''}`}
                            type="button"
                        >
                            <span className="hamburger-top bg-slate-900 dark:bg-slate-50"></span>
                            <span className="hamburger-middle bg-slate-900 dark:bg-slate-50"></span>
                            <span className="hamburger-bottom bg-slate-900 dark:bg-slate-50"></span>
                        </button>
                    </div>
                </div>

                {isMobMenuOpen && (
                    <Dialog>
                        <div className="md:hidden bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700 border-gray-100 py-4">
                            <div className="max-w-[1400px] mx-auto px-4 space-y-4">
                                {renderNavLinks()}
                                <div className='flex items-center gap-3 mt-5'>
                                    {user.role === 'ADMIN' && <CommonFilter
                                        filterValue="gTenant"
                                        filters={filters.lTenants}
                                        otherClasses="min-h-[40px] sm:min-w-[150px]"
                                    />}
                                    <ModeToggle />
                                    <DialogTrigger asChild>
                                        <Button variant='destructive' className='rounded-full cursor-pointer'>
                                            Log Out
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>
                        </div>

                        <LogoutModal />
                    </Dialog>
                )}
            </nav>
        </div>
    )
}