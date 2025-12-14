import Link from 'next/link'
import Image from 'next/image'

const navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className='logo'>
                <Image src="/icons/logo.png" alt="logo" height={24} width={24}/>
                <p>DevEvent</p>
            </Link>

            <ul className='list-none'>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/">Events</Link></li>
                <li><Link href="/">Create Event</Link></li>
            </ul>
        </nav>
    </header>
  )
}

export default navbar
