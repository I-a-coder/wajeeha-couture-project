import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";

export default async function Faqs() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/faqData.json",
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
          <div key={index}>
            <h5 className="font-semibold">{section.question}</h5>
            <p className="text-gray-400">{section.answer}</p>
            {section.benefits && (
              <ul className="list-disc list-inside ml-5">
                {section.benefits.map((benefit, bIndex) => (
                  <li key={bIndex}>{benefit}</li> // Use index as a key for benefits
                ))}
              </ul>
            )}
            {section.paymentOptions && (
              <ul className="list-disc list-inside ml-5">
                {section.paymentOptions.map((option, oIndex) => (
                  <li key={oIndex}>{option}</li> // Use index as a key for payment options
                ))}
              </ul>
            )}
            {section.note && <p className="text-red-500">{section.note}</p>}
            <br />
          </div>
        ))}
      </div>
    </Layout>
  );
}
