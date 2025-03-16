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
        <div className="w-full h-full bg-transparent backdrop-blur">
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
      icon: <img src="/Icon/finder.png" alt="AboutMe" className="w-55 h-55 object-cover rounded-lg" />,
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
      icon: <img src="/Icon/code.png" alt="VS Code" className="w-full h-full rounded-lg object-cover" />,
      background: "bg-transparent",
    },
    {
      name: "WallpaperApp",
      icon: <svg className="w-full rounded-lg h-full object-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="settings">
  <defs>
    <linearGradient id="a" x1="60" x2="60" y1="16" y2="-104" gradientTransform="translate(0 104)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8e8e93"></stop>
      <stop offset="1" stop-color="#e5e5ea"></stop>
    </linearGradient>
    <linearGradient id="b" x1="-419.218" x2="-419.218" y1="-738.899" y2="-740.899" gradientTransform="matrix(32.005 0 0 -32 13477.133 -23616.804)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b4b4b9"></stop>
      <stop offset="1" stop-color="#b4b4b9"></stop>
    </linearGradient>
    <linearGradient id="c" x1="-427.251" x2="-427.251" y1="-728.117" y2="-730.117" gradientTransform="matrix(48 0 0 -47.955 20567.514 -34904.894)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#dcdce1"></stop>
      <stop offset="1" stop-color="#98989d"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#a)" d="M26,0H94a25.94821,25.94821,0,0,1,26,26V94a25.94821,25.94821,0,0,1-26,26H26A25.94821,25.94821,0,0,1,0,94V26A25.94818,25.94818,0,0,1,26,0Z"></path>
  <circle cx="60" cy="60" r="52" fill="#2e2e2f"></circle>
  <path fill="url(#b)" fill-rule="evenodd" d="M59,32h1.7l.8-4h.7l.3,4.1a7.71991,7.71991,0,0,1,1.5.2l1.2-3.9.7.1-.2,4.1a8.33085,8.33085,0,0,1,1.5.4l1.6-3.7.6.2-.7,4c.5.2,1,.3,1.5.5l2-3.5.6.3-1.1,3.9c.5.2.9.5,1.4.7l2.4-3.3.6.3-1.6,3.8c.4.3.9.6,1.3.9l2.8-3,.5.4-2,3.6c.4.3.8.7,1.2,1l3.1-2.6.5.5-2.4,3.3,1.1,1.1L84,39.2l.4.5-2.7,3,.9,1.2,3.6-1.8.4.6-3.1,2.7c.3.4.5.9.8,1.3l3.8-1.4.3.6L85,48.2l.6,1.5,3.9-.9.2.6-3.5,1.8c.2.5.3,1,.5,1.5l4-.5.2.7-3.8,1.4c.1.5.2,1,.3,1.6h4.1l.1.7-3.9,1c0,.5.1,1.1.1,1.6l4,.5v.7l-4,.5a7.56868,7.56868,0,0,1-.1,1.5l3.9.9-.1.7-4,.1-.3,1.5L91,67l-.1.6-4-.4c-.1.5-.3,1-.4,1.5l3.6,1.8-.2.6-4-.9-.6,1.5,3.4,2.3-.3.6-3.9-1.3c-.2.4-.5.9-.7,1.3l3.1,2.6-.4.6-3.6-1.8a11.32046,11.32046,0,0,1-1,1.3l2.8,2.9-.4.5-3.4-2.2a5.7309,5.7309,0,0,1-1.1,1.1l2.4,3.3-.5.5-3.2-2.6a10.59078,10.59078,0,0,1-1.2,1l2,3.5-.5.4-2.8-2.9c-.4.3-.9.6-1.3.9l1.6,3.8-.6.3-2.5-3.2a9.14221,9.14221,0,0,1-1.4.7l1.2,3.9-.6.3-2.1-3.5a8.8008,8.8008,0,0,1-1.5.5l.7,4-.6.2-1.7-3.7c-.5.1-1,.3-1.5.4l.2,4.1-.7.1-1.2-3.9c-.5.1-1,.1-1.6.2l-.2,4.1h-.7l-.8-4H59l-.7,4h-.4l-.3-4.1a9.97269,9.97269,0,0,1-1.6-.2l-1.2,3.9-.7-.1.2-4.1a8.33085,8.33085,0,0,1-1.5-.4l-1.6,3.7-.6-.2.7-4c-.5-.2-1-.3-1.5-.5l-2.1,3.5-.6-.3,1.1-3.9c-.5-.2-.9-.5-1.4-.7l-2.4,3.3-.6-.3,1.6-3.8c-.4-.3-.9-.6-1.3-.9l-2.8,3-.5-.4,2-3.6c-.4-.3-.8-.7-1.2-1l-3.1,2.6-.5-.5,2.4-3.3a11.40689,11.40689,0,0,0-1.1-1.1l-3.4,2.3-.4-.5,2.8-3a14.699,14.699,0,0,1-1-1.3l-3.6,1.8-.4-.6,3.1-2.6c-.3-.4-.5-.9-.8-1.4l-3.8,1.4-.3-.6,3.4-2.3-.6-1.5-3.9.9-.2-.6,3.6-1.9c-.2-.5-.3-1-.5-1.5l-4,.5-.2-.7,3.8-1.4c-.1-.5-.2-1-.3-1.6h-4l-.1-.7,3.9-1c0-.5-.1-1-.1-1.6l-4-.5v-.7l4-.5a8.60213,8.60213,0,0,1,.1-1.6l-3.9-.9.1-.7,4-.1.3-1.5-3.8-1.4.2-.6,4,.4c.1-.5.3-1,.4-1.5l-3.6-1.8.2-.6,3.9.9.6-1.5-3.4-2.2.3-.6,3.8,1.3c.3-.5.5-.9.8-1.4l-3.1-2.6.4-.6,3.6,1.8c.3-.4.6-.9.9-1.3l-2.8-3,.4-.5,3.4,2.2A11.984,11.984,0,0,1,40.2,40l-2.4-3.3.5-.5,3.1,2.6a10.59253,10.59253,0,0,1,1.2-1l-2-3.5.5-.4,2.8,2.9c.4-.3.9-.6,1.3-.9l-1.6-3.7.6-.3,2.5,3.2a9.14311,9.14311,0,0,1,1.4-.7L47,30.5l.6-.3,2.1,3.5a8.79992,8.79992,0,0,1,1.5-.5l-.7-4,.6-.2,1.7,3.7c.5-.1,1-.3,1.5-.4l-.2-4.1.7-.1L56,32c.5-.1,1-.1,1.6-.2l.2-4.1h.7Zm1,5.4A22.5,22.5,0,1,0,82.5,59.9,22.53391,22.53391,0,0,0,60,37.4Z"></path>
  <path fill="url(#c)" fill-rule="evenodd" d="M58.5,18h2.4L62,12h1l.4,6.1c.8.1,1.6.2,2.3.3l1.8-5.9,1,.2-.3,6.2c.8.2,1.5.3,2.2.5l2.5-5.7,1,.3-1,6.2A18.02753,18.02753,0,0,1,75,21l3.2-5.5.9.4L77.4,22c.7.3,1.4.7,2,1l3.8-5.1.9.5-2.5,5.9a21.41153,21.41153,0,0,1,1.9,1.3l4.4-4.7.8.6-3.2,5.6c.6.5,1.2,1,1.7,1.5l4.9-4.1.7.7L89,30.4c.5.5,1,1.1,1.5,1.6l5.4-3.5.6.8-4.4,4.8a20.28184,20.28184,0,0,1,1.3,1.8L99.2,33l.6.8-4.9,4.3A18.57691,18.57691,0,0,1,96,40l6.2-2.2.5.9-5.4,3.7c.3.7.6,1.3.9,2l6.4-1.5.3.9-5.8,3,.6,2.1,6.5-.7.2,1-6.1,2.3c.1.7.3,1.4.4,2.1h6.6l.1,1L101,56.2a16.94811,16.94811,0,0,1,.1,2.3l6.5.8v1l-6.5.8c0,.7-.1,1.4-.1,2.1l6.4,1.5-.1,1-6.6.1a16.9594,16.9594,0,0,1-.4,2.2l6.1,2.3-.2,1-6.5-.7-.6,2.1,5.8,2.9-.3.9-6.3-1.4q-.45,1.05-.9,2.1l5.4,3.6-.4.9-6.1-2.1a11.7816,11.7816,0,0,1-1.1,1.9l4.9,4.2-.5.8-5.8-2.8c-.4.6-.9,1.2-1.3,1.8l4.4,4.7-.6.8-5.4-3.5c-.5.6-1,1.1-1.5,1.7l3.8,5.1-.7.7-4.9-4c-.6.5-1.1,1-1.7,1.5l3.1,5.5-.8.6-4.4-4.5c-.6.4-1.2.9-1.9,1.3l2.5,5.7-.9.5-3.8-4.9c-.7.4-1.4.7-2.1,1.1l1.8,6-.9.4-3.2-5.3a18.02525,18.02525,0,0,1-2.1.8l1.1,6.1-1,.3-2.5-5.6c-.7.2-1.5.4-2.3.6l.3,6-1,.2-1.8-5.7-2.4.3-.4,6-1,.1-1.1-5.9H58.5l-1.1,5.9-1-.1-.4-6c-.8-.1-1.6-.1-2.4-.2l-1.7,5.7-1-.2.3-5.9c-.8-.2-1.6-.3-2.4-.5l-2.4,5.4-1-.3.9-5.8a20.94173,20.94173,0,0,1-2.3-.8l-2.9,5-.9-.4,1.6-5.6a15.05213,15.05213,0,0,1-2.2-1.1l-3.5,4.6-.9-.5,2.2-5.3c-.7-.4-1.4-.9-2.1-1.3l-3.9,4.2-.8-.6,2.8-5c-.7-.5-1.3-1-2-1.6l-4.4,3.6-.7-.7,3.3-4.6-1.8-1.8-4.7,3.1-.7-.8,3.8-4.2c-.5-.7-1-1.3-1.5-2l-5,2.5-.6-.8,4.2-3.7a25.29321,25.29321,0,0,1-1.3-2.2l-5.3,1.9-.4-.9,4.6-3.1a24.43217,24.43217,0,0,1-1-2.4l-5.4,1.2-.3-.9,4.9-2.5c-.3-.8-.5-1.6-.8-2.5l-5.5.6-.2-1,5.2-1.9c-.2-.8-.3-1.7-.5-2.5H11.7l-.1-1,5.4-1.4c-.1-.8-.1-1.7-.2-2.5l-5.5-.7v-1l5.5-.7c0-.9.1-1.7.1-2.6l-5.4-1.3.1-1,5.6-.1c.1-.8.3-1.7.4-2.5l-5.2-1.9.2-1,5.5.6c.2-.8.5-1.6.7-2.5l-5-2.5.4-.9,5.4,1.2c.3-.8.7-1.6,1-2.3l-4.7-3.1.4-.9,5.3,1.9a25.29082,25.29082,0,0,1,1.3-2.2l-4.3-3.6.5-.8,5.1,2.5c.5-.7,1-1.4,1.5-2l-3.9-4.2.6-.8,4.8,3.1c.6-.6,1.1-1.2,1.7-1.8l-3.4-4.6.7-.7,4.5,3.6c.6-.5,1.3-1.1,1.9-1.6l-2.9-5,.8-.6,4,4.2c.7-.5,1.4-.9,2.1-1.4l-2.3-5.4.9-.5,3.6,4.6c.7-.4,1.5-.7,2.2-1.1l-1.7-5.6.9-.4,3,5.1a20.94173,20.94173,0,0,1,2.3-.8l-1-5.9,1-.3,2.4,5.4a18.91938,18.91938,0,0,1,2.3-.5l-.3-6,1-.2,1.8,5.7,2.4-.3.4-6,1-.1ZM34.1,86.8c2.7,2.6,7.1,1.5,9-1.8L53.9,66a11.97339,11.97339,0,0,0-.2-12L42.6,35.2c-1.9-3.2-6.3-4.3-9-1.6a36.8468,36.8468,0,0,0,.5,53.2Zm23-34.9a12.42173,12.42173,0,0,0,10.6,6H89.5c3.8,0,6.9-3.2,6-6.9A37.06052,37.06052,0,0,0,48.9,24.5c-3.6,1.1-4.9,5.4-3,8.7ZM67.8,62a12.25644,12.25644,0,0,0-10.5,6L46.5,87a5.77243,5.77243,0,0,0,3.2,8.6A37.07065,37.07065,0,0,0,95.6,68.8c.9-3.6-2.2-6.9-6-6.9Zm-8.3-4a2,2,0,1,0,2,2A2.00587,2.00587,0,0,0,59.5,58Z"></path>
</svg>,
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
    {
      name: "Instagram",
      icon: <img src="/Icon/ig.jpg" alt="Instagram" className="w-full h-full object-cover rounded-lg" />,
      background: "bg-transparent",
    },
    {
      name: "Youtube",
      icon: <img src="/Icon/yt.png" alt="Github" />,
      background: "bg-white"
    },
    {
      name: "Aplle Music",
      icon: <img src="/Icon/itune.jpg" alt="Github" />,
      background: "bg-white"
    },

    {
      name: "Github",
      icon: <img src="/Icon/git.png" alt="Github" />,
    background: "bg-white"
    }
  ];

  return (
    <div className="fixed left-1/2 transform bottom-[1px] -translate-x-1/2">
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
