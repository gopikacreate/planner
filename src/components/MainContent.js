import Bride from './Bride';
import Groom from './Groom';
import Events from './Events'; 
export default function MainContent({ section }) {
  return (
    <div className="main-content">
      {section === 'Bride' && <Bride/>}
      {section === 'Groom' && <Groom />}
      {section === 'Events' && <Events />}
    </div>
  );
}







