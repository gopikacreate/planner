import { useState } from 'react';

export default function Sidebar({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const sections = ['Bride', 'Groom', 'Events'];

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Hamburger */}
      <div className="hamburger" onClick={toggleSidebar}>
        ☰
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Wedding Planner</h2>
        {sections.map((section) => (
          <div
            key={section}
            onClick={() => {
              onSelect(section);
              setIsOpen(false); // Close sidebar on select
            }}
            className="sidebar-item"
          >
            {section}
          </div>
        ))}
      </div>
    </>
  );
}
