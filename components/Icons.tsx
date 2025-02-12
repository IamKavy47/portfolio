import { FaRegFolder } from "react-icons/fa"
import { BsChatDots, BsEnvelope, BsCompass, BsImages, BsGear } from "react-icons/bs"

export function IconFinder() {
  return <FaRegFolder className="w-8 h-8 text-blue-500" />
}

export function IconMessages() {
  return <BsChatDots className="w-8 h-8 text-green-500" />
}

export function IconMail() {
  return <BsEnvelope className="w-8 h-8 text-blue-400" />
}

export function IconSafari() {
  return <BsCompass className="w-8 h-8 text-blue-600" />
}

export function IconPhotos() {
  return <BsImages className="w-8 h-8 text-rose-500" />
}

export function IconSettings() {
  return <BsGear className="w-8 h-8 text-gray-600" />
}

