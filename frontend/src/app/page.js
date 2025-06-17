import Image from "next/image";
import { redirect } from 'next/navigation';

export default function Home() {
  return (
   
  //  <div className="grid grid-cols-1 w-full h-full">
  //   <div className={'flex justify-center items-center'}>
  //     Home Page
  //  </div>
  //  </div>
    redirect('/dashboard')
  );
}
