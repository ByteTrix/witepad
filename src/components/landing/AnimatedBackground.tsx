
import React from 'react';

const AnimatedBackground = () => {
  const items = Array.from({ length: 10 });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <ul className="circles">
        {items.map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>
    </div>
  );
};

export default AnimatedBackground;
