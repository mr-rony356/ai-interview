'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
const { user, error, isLoading } = useUser();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>{error.message}</div>;

return (
    user && (
        <div className='flex justify-center shadow-md bg-gray-100 p-4 flex-col items-center'>
            <img src={user.picture ?? ''} alt={user.name ?? ''} className='rounded-full w-20 h-20' />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    )
);
}