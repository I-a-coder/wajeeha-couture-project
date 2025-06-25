import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";

export default async function PrivacyPolicy() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/privacyPolicyData.json",
    "utf8"
  );
  const data = JSON.parse(file);

  return (
    <Layout>
      <div className="flex flex-col p-10">
        <h5 className="text-3xl font-medium text-center mb-10">
          {data.title}
        </h5>
        {data.sections.map((section, index) => (
          <div key={index}>
            <h5 className="font-bold">{section.title}</h5>
            {section.content && <p className="text-gray-400 mb-5">{section.content}</p>}
            {section.list && (
              <ul>
                {section.list.map((item, itemIndex) => (
                  <li className="text-gray-400" key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
            <div className="mb-5"></div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
