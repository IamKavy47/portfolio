"use client"

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styled from "styled-components";

// Styled components
const DockContainer = styled(motion.div)<{ $themeColor?: string }>`
  margin: 0 auto;
  display: flex;
  height: 4.5rem;
  align-items: end;
  gap: 6px;
  padding: 0 10px;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
`;

const DockIcon = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DockLink = styled.a`
  margin-bottom: -5px;
`;

const AppIndicator = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
`;

const ToolTip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 5px;
  white-space: nowrap;
  pointer-events: none;
`;

// AppIcon component
interface AppIconProps {
  mouseX: any;
  item: {
    name: string;
    icon: React.ReactNode;
    background: string;
    link?: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

function AppIcon({ mouseX, item, isOpen, onClick }: AppIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Calculate distance from mouse cursor to this icon
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  
  // Transform distance to width
  const widthSync = useTransform(distance, [-150, 0, 150], [50, 70, 50]);
  
  // Add spring physics
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  
  // Y position based on width
  const y = useTransform(width, [50, 70], [0, -10]);
  
  // Tooltip opacity
  const tooltipOpacity = useTransform(width, [50, 60, 70], [0, 0, 1]);

  return (
    <DockIcon ref={ref} style={{ width }}>
      <motion.div 
        style={{ 
          y,
          width: width, 
          height: width,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
      >
        {item.icon}
      </motion.div>
      
      {isOpen && <AppIndicator />}
      
      <ToolTip style={{ opacity: tooltipOpacity }}>
        {item.name}
      </ToolTip>
    </DockIcon>
  );
}

// Main Dock component
interface DockProps {
  openApp: (appName: string) => void;
  openApps: string[];
}

export default function Dock({ openApp, openApps }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  
  // Using the same dock items from your original code
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
              <stop offset="0" stop-color="#d4d4d2"></stop>
              <stop offset="1" stop-color="#d4d4d2"></stop>
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

  const handleOpenApp = (appName: string) => {
    openApp(appName);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <DockContainer
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {dockItems.map((item, index) => (
          <AppIcon
            key={item.name}
            item={item}
            mouseX={mouseX}
            isOpen={openApps.includes(item.name)}
            onClick={() => handleOpenApp(item.name)}
          />
        ))}
      </DockContainer>
      
      {/* Dock reflection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mx-auto mt-1 w-3/4 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm"
      />
    </div>
  );
}
