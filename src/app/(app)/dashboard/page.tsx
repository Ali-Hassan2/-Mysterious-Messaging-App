"use client"

const page = () => {
  return (
    <>
      <div className="w-full h-[90vh] border-4 border-red-600">
        <div className="upper h-[100px] border-4 border-blue-600 text-[2vw] font-bold pl-3">
          User Dashboard
        </div>
        <div className="h-[300px] border-2 border-green-400 flex items-center justify-center">
          <div className="left w-[50vw] border-4 border-red-700 h-full">
            Your Messages
          </div>
          <div className="right w-[50vw] h-full flex justify-center items-center">
            <div className="box h-[4vw] w-[20vw] bg-blue-200 p-2 flex items-center justify-betweer">
              Your Messages
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default page
