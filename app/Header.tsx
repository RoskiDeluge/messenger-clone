import Image from 'next/image'
import Link from 'next/link'
import LogoutButton from './LogoutButton';
import { unstable_getServerSession } from 'next-auth';


async function Header() {
  const session = await unstable_getServerSession()

  if (session) return (

    <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 shadow-sm">
      <div className="flex space-x-2 ">
        <Image className="rounded-full mx-2 object-contain" height={50} width={50} src={session.user?.image!} alt="Profile Picture"/>
        <div>  
          <p className="text-purple-400">Logged in as:</p>
          <p className="font-bold text-lg">{session.user?.name}</p>
        </div>
      </div>
      <LogoutButton />
    </header>
  )
  return (
    <header className="sticky top-0 z-50 bg-white flex justify-center items-center p-10 shadow-sm">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex space-x-2 items-center">
          <Image src="https://aleph42.s3.amazonaws.com/aleph-logo.png" height={50} width={50} alt="Logo" />
          <p className="text-purple-900">Welcome to Aleph</p>
        </div>
        <Link href="/auth/signin" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Sign In</Link>
      </div>
    </header>
  )
}

export default Header