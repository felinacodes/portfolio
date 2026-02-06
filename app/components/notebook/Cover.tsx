import React, { useState } from 'react'

interface CoverProps {
  side: string
  face: string
  isOpen?: boolean
  setIsOpen: (isOpen: boolean) => void
  pagesPerView: number
}

const Cover = ({ side, face, isOpen, setIsOpen, pagesPerView }: CoverProps) => {
  // console.log('book is' + isOpen)
  // const [isOpen, setIsOpen] = useState(side === 'front' ? false : true)

  // const toggleSide = () => {
  //   setIsOpen(!isOpen)
  //   // console.log(isOpen)
  // }
  // console.log('book is' + isOpen)
  // <div className="bg-blue-500 w-full h-full"> closed </div>
  // console.log('side is ' + side)
  // console.log('face is ' + face)
  return (
    // <div
    //   // onClick={toggleSide}
    //   className=" text-center w-full h-full flex flex-col justify-center items-center p-4"
    // >
    //   {face === 'inside' ? (
    //     <div className="bg-pink-500 w-full h-full"> INSIDE</div>
    //   ) : side === 'front' ? (
    //     <div className="bg-blue-500 w-full h-full"> FRONT COVER</div>
    //   ) : (
    //     <div className="bg-blue-500 w-full h-full"> BACK COVER</div>
    //   )}
    // </div>

    // <div
    //   // onClick={toggleSide}
    //   className=" text-center w-full h-full flex flex-col justify-center items-center p-4"
    // >
    //   {/* {pagesPerView === 1 && ()} */}
    //   {!isOpen ? (
    //     <div className="bg-pink-500 w-full h-full"> COVER OUTSIDE</div>
    //   ) : (
    //     <div className="bg-blue-500 w-full h-full"> COVER INSIDE</div>
    //   )}
    // </div>
    <div className=" text-center w-full h-full flex flex-col justify-center items-center p-4">
      <p>
        cover {side} {face}
      </p>
    </div>
  )
}

export default Cover
