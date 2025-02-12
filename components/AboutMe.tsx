import { useDeviceDetect } from "@/hooks/useDeviceDetect"
import Window from "./Window"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Code, Briefcase, GraduationCap, Award } from "lucide-react"

interface AboutMeProps {
  onClose: () => void
  onFocus: () => void
}

export default function AboutMe({ onClose, onFocus }: AboutMeProps) {
  const { deviceType } = useDeviceDetect()

  const content = (
    <div
      className={`h-full ${deviceType === "mobile" ? "ios-content" : "bg-gray-100 text-gray-800 p-6"} overflow-auto`}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
          <Image src="/placeholder.svg" alt="Kavy Porwal" width={128} height={128} className="object-cover" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Kavy Porwal</h1>
        <h2 className="text-xl text-gray-600">Frontent Developer</h2>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Node.js", "Python"].map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Experience
          </h3>
          <div className="space-y-2">
            <div>
              <h4 className="font-medium">Error 404</h4>
              <p className="text-sm text-gray-600">No Experience Found</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education
          </h3>
          <div>
            <h4 className="font-medium">B.tech in Computer Science</h4>
            <p className="text-sm text-gray-600">Mandsaur University, 2024-2028</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </h3>
          <ul className="list-disc list-inside text-sm">
            <li>Loading....</li>
            
          </ul>
        </section>
      </div>

      <div className="mt-6 text-center">
        <Button variant="default">Download Resume</Button>
      </div>
    </div>
  )

  if (deviceType === "mobile") {
    return (
      <div className="ios-app">
        <div className="ios-header">
          <button className="ios-back-button" onClick={onClose}>
            Back
          </button>
          <h1 className="text-xl font-semibold">About Me</h1>
          <div className="w-16"></div>
        </div>
        {content}
      </div>
    )
  }

  return (
    <Window title="About Me" onClose={onClose} onFocus={onFocus} initialSize={{ width: 600, height: 500 }}>
      {content}
    </Window>
  )
}

