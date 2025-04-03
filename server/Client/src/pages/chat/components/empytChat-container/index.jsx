import { animationDefaultOtpions } from '@/lib/utils'
import Lottie from 'react-lottie'

function EmptyChatContainer(props) {
  let Theme ={}
  if(props.theme ==="dark"){
    Theme ={
      bg:"bg-[#19232c] ",
      text:"text-white",
      secondarText:"text-green-500",

    }
  }else{
    Theme ={
      bg:"lg:bg-[#f3f4f7]",
      text:"text-black",
      secondarText:"text-green-900",

    }
  }
  return (
    <div className={`flex-1 ${Theme.bg} lg:flex flex-col justify-center items-center hidden duration-1000 transition-all`}>
      <Lottie
      isClickToPauseDisabled={true}
      height={200}
      width={200}
      options={animationDefaultOtpions}
      />
      <div className={`text-opacity-80 ${Theme.text} flex flex-col gap-5 items-center mt-10 lg:4xl text-3xl transition-all duration-300 text-center`}>
        <h3 className="font-sans">
          Hi <span className={Theme.secondarText}>{props.user?.firstName} {props.user?.lastName}</span>, Welcome to <span className={Theme.secondarText}>ConnetcyPi.</span>
        </h3>
        <p className=''>
        Stay  <span className={Theme.secondarText}>Connected</span>, Always<span className={Theme.secondarText}>.</span>
        </p>
      </div>
    </div>
  )
}

export default EmptyChatContainer