import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';


export default function Home() {
  const [section, setSection] = useState('Bride');

  return (
    <div className="container">
      <Sidebar onSelect={setSection} />
      <MainContent section={section} />
    </div>
  );
}
