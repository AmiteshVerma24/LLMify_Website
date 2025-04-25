import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/AuthButtons/SignOutButton';
import Link from 'next/link';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/');
  }
  console.log(session);
  
  return (
    <div className="container text-white">
      <main>
        <h1>User Profile</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            {session.user.image ? (
              <img src={session.user.image} alt="Profile" className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {session.user.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h2>{session.user.name}</h2>
              <p>{session.user.email}</p>
              <p>{session.user.id}</p>
            </div>
          </div>
          
          <div className="profile-content">
            <h3>Account Information</h3>
            <p>This is where you can display user-specific information and settings.</p>
          </div>
          
          <div className="buttons">
            <Link href="/" className="button button-secondary">
              Back to Home
            </Link>
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}