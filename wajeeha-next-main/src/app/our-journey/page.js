import Layout from "@/utilities/Layout";
import Image from "next/image";
import { promises as fs } from "fs";

export default async function Journey() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/journeyData.json",
    "utf8"
  );
  const data = JSON.parse(file);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Content Section */}
        <div className="content lg:w-[65%] px-6 lg:px-32">
          {/* Main Content Section */}
          <div className="py-10 text-start">
            <h1 className="text-3xl font-medium flex justify-center lg:justify-start items-center uppercase px-5">
              {data.title}
            </h1>
            {data.sections.map((section, index) => (
              <div className="max-w-screen-lg text-gray-400 px-6 py-3" key={index}>
                {/* Split body by newlines and render each paragraph */}
                {section.content.body.split("\n\n").map((paragraph, i) => (
                  <p className="mb-4" key={i}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="image lg:w-[35%] h-screen mb-2 lg:mb-0 overflow-hidden">
          <Image
            src={`https://static.wajeehacouture.com/assets/${data.image}`}
            alt="Wajeeha"
            className="w-full h-full object-cover rounded-lg"
            width={500}
            height={500}
          />
        </div>
      </div>
    </Layout>
  );
}
