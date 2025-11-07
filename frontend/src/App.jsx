import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import RecordList from './components/RecordList';
import { getAuth } from './utils/auth';

export default function App(){
  const [page, setPage] = useState('records');
  const auth = getAuth();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Navbar />
      <main>
        {!auth ? <Auth /> : <RecordList />}
      </main>
    </div>
  );
}
