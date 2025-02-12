import Image from "next/image"
import { ChevronLeft } from "lucide-react"

interface IOSAboutMeProps {
  onClose: () => void
}

export default function IOSAboutMe({ onClose }: IOSAboutMeProps) {
  return (
    <div className="h-full bg-white text-black">
      <header className="bg-gray-100 p-4 flex items-center">
        <button onClick={onClose} className="text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold ml-4">About Me</h1>
      </header>
      <div className="p-4 overflow-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-4">
            <Image src="/placeholder.svg" alt="Kavy Porwal" width={128} height={128} className="object-cover" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Kavy Porwal</h2>
          <h3 className="text-lg text-gray-600">Full Stack Developer</h3>
        </div>

        <section className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Node.js", "Python", "AWS", "Docker"].map((skill) => (
              <span key={skill} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Experience</h4>
          <div className="space-y-2">
            <div>
              <h5 className="font-medium">Senior Developer at Tech Co</h5>
              <p className="text-sm text-gray-600">2020 - Present</p>
            </div>
            <div>
              <h5 className="font-medium">Full Stack Developer at Startup Inc</h5>
              <p className="text-sm text-gray-600">2018 - 2020</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Education</h4>
          <div>
            <h5 className="font-medium">B.S. in Computer Science</h5>
            <p className="text-sm text-gray-600">University of Technology, 2018</p>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-2">Achievements</h4>
          <ul className="list-disc list-inside text-sm">
            <li>Winner of Hackathon 2022</li>
            <li>Open Source Contributor of the Year 2021</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

