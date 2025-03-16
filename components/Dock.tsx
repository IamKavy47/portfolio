import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AppIconProps {
  mouseX: any;
  item: {
    name: string;
    icon: React.ReactNode;
    background: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

function AppIcon({ mouseX, item, isOpen, onClick }: AppIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Adjusted scaling values for more subtle animation
  const widthSync = useTransform(distance, [-300, 0, 300], [55, 75, 55]);
 const width = useSpring(widthSync, {
  mass: 0.1,
  stiffness: 200,
  damping: 12
});

const height = useSpring(widthSync, {
  mass: 0.1,
  stiffness: 200,
  damping: 6
});

  
  const y = useTransform(width, [55, 100], [0, -20]);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="relative flex items-end justify-center"
    >
      <motion.div
        style={{
          y,
          width: width,
          height: height,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`
          relative 
          rounded-xl 
          flex 
          items-center 
          justify-center 
          overflow-hidden
          shadow-lg
          ${isOpen ? 'after:absolute after:bottom-[-8px] after:w-1 after:h-1 after:bg-white/50 after:rounded-full' : ''}
        `}
      >
        <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent backdrop-blur">
          {item.icon}
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
          y: isOpen ? 0 : 5
        }}
        transition={{ duration: 0.2 }}
        className="absolute -bottom-2 w-1 h-1 bg-white/50 rounded-full"
      />
    </motion.div>
  );
}

interface DockProps {
  openApp: (appName: string) => void;
  openApps: string[];
}

export default function Dock({ openApp, openApps }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  const dockItems = [
    {
      name: "AboutMe",
      icon: <img src="https://i.ibb.co/LDzGD6QZ/generated-image-1741935068996.webp" alt="AboutMe" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
    {
      name: "Projects",
      icon: <img src="/Icon/project.png" alt="projects" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
    {
      name: "Calculator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calculator" className="w-full h-full rounded-lg">
          <defs>
            <linearGradient id="a" x1="59.25" x2="60.76" y1="119.1" y2="-.16" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#d4d4d2"></stop>
              <stop offset="1" stopColor="#d4d4d2"></stop>
            </linearGradient>
          </defs>
          <rect width="120" height="120" fill="url(#a)" rx="26"></rect>
          <rect width="62" height="90" x="29" y="15" fill="#1c1c1c" rx="8"></rect>
          <rect width="50" height="21" x="35" y="21" fill="#505050" rx="4"></rect>
          <circle cx="41" cy="55" r="6" fill="#d4d4d2"></circle>
          <circle cx="60" cy="55" r="6" fill="#d4d4d2"></circle>
          <circle cx="79" cy="55" r="6" fill="#fe9500"></circle>
          <circle cx="41" cy="74" r="6" fill="#d4d4d2"></circle>
          <circle cx="60" cy="74" r="6" fill="#d4d4d2"></circle>
          <circle cx="79" cy="74" r="6" fill="#fe9500"></circle>
          <path fill="#d4d4d2" d="M41 99a6 6 0 0 1 0-12h19a6 6 0 0 1 0 12Z"></path>
          <circle cx="79" cy="93" r="6" fill="#fe9500"></circle>
        </svg>
      ),
      background: "bg-transparent",
    },
    {
      name: "VSCode",
      icon: <img src="/Icon/code.png" alt="VS Code" className="w-full h-full object-cover" />,
      background: "bg-transparent",
    },
    {
      name: "WallpaperApp",
      icon: <img src="/Icon/gallery.jpg" alt="wallpaper" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
    {
      name: "Safari",
      icon: <img src="/Icon/safari.png" alt="safari" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
    {
      name: "ContactApp",
      icon: <img src="/Icon/Contacts.png" alt="contact" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
  ];

  return (
    <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2">
      <motion.div
        className="flex items-end gap-5 px-4 py-2 h-[4.5rem] bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        {dockItems.map((item) => (
          <AppIcon
            key={item.name}
            item={item}
            mouseX={mouseX}
            isOpen={openApps.includes(item.name)}
            onClick={() => openApp(item.name)}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-1 w-[90%] h-4 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-lg"
      />
    </div>
  );
}
