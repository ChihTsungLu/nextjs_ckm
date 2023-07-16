import Link from 'next/link'
import Image from 'next/image'
import { NavLinks } from '@/constant'
import AuthProviders from './AuthProviders'
const Navbar = () => {

  const session ={}
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
          {session ? (
            <>
              UserPhoto
              <Link href="/create-knowledge">
                Share Work
              </Link>
            </>
          ):(
            <AuthProviders/>
          )}
      </div>
    </nav>
  )
}

export default Navbar