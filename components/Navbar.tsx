import Link from 'next/link'
import Image from 'next/image'
import { NavLinks } from '@/constant'
import AuthProviders from './AuthProviders'
import { getCurrentUser } from '@/lib/session'
import { signOut } from 'next-auth/react'
import ProfileMenu from './ProfileMenu'
const Navbar = async() => {

  const session =  await getCurrentUser(); //get user data

  return (
    <nav className='flexBetween navbar'>
      <div className='flex-1 flexStart gap-10'>
        <Link href='/'>
          <Image
            src="/logo.png"
            width={25}
            height={13}
            alt='logo'
            />
          </Link>
          <ul className='xl:flex hidden text-small gap-7'>
            {NavLinks.map((link)=>(
              <Link href={link.href} key={link.text}>
                {link.text}
              </Link>
            ))}
          </ul>
      </div>
      <div className='flexCenter gap-4'>
          {session?.user ? (
            <>
              {/* Any kind of client side of property, converting part of this to a Client Component. */}
              {/* Extract the code into an additional component; */}
             <ProfileMenu session={session}/>
              <Link href="/create-knowledge">
                Share Work
              </Link>
            </>
          ):(
            <AuthProviders/>
          )
          }
      </div>
    </nav>
  )
}

export default Navbar