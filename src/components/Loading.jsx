import React from 'react'

export default function Loading() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 ">
            <div className="flex justify-center items-center align-middle h-screen">
                <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
                    <div className="border-t-transparent border-solid animate-spin  rounded-full border-amber-500 border-8 h-64 w-64"></div>

                </div>
                <span className="visually-hidden text-amber-600">Loading...</span>
            </div>
        </section >
    )
}
