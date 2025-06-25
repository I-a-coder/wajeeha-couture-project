import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";

export default async function ReturnExchange() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/returnExchangeData.json",
    "utf8"
  );
  const data = JSON.parse(file);

  return (
    <Layout>
      <div className="flex flex-col p-10">
        <h5 className="text-3xl font-medium text-center uppercase mb-10">
          {data.title}
        </h5>

        {data.sections.map((section, index) => (
          <div className="mb-5" key={index}>
            <h5 className="font-bold mb-3">{section.title}</h5>
            <ul className="list-none pl-0">
              {section.content
                .split("\n")
                .map(
                  (item, itemIndex) =>
                    item.trim() && <li className="text-gray-400 mb-3" key={itemIndex}>{item.trim()}</li>
                )}
              {section.highlightedContent &&
                section.highlightedContent.split("\n").map(
                  (item, itemIndex) =>
                    item.trim() && (
                      <li className="mb-3" key={itemIndex}>
                        <p className="text-gray-400 font-semibold">
                          *{item.replace(/\*\*(.+?)\*\*/g, "$1")}
                        </p>
                      </li>
                    )
                )}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
}
