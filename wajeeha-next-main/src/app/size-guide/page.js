import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";

export default async function SizeGuide() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/sizeGuideData.json",
    "utf8"
  );

  const data = JSON.parse(file);

  return (
    <Layout>
      <div className="flex flex-col py-10 px-4 lg:px-0">
        <div className="flex flex-col justify-center items-center mb-10">
          <h1 className="text-3xl font-medium text-center uppercase px-5">
            {data.title}
          </h1>
        </div>

        <div className="overflow-x-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Shirts (Inches)</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Sizes</th>
                <th className="py-2 px-4 text-left">XS (In)</th>
                <th className="py-2 px-4 text-left">S (In)</th>
                <th className="py-2 px-4 text-left">M (In)</th>
                <th className="py-2 px-4 text-left">L (In)</th>
                <th className="py-2 px-4 text-left">XL (In)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border">Full Shirt</td>
                <td className="py-2 px-4 border">46</td>
                <td className="py-2 px-4 border">46</td>
                <td className="py-2 px-4 border">48</td>
                <td className="py-2 px-4 border">48</td>
                <td className="py-2 px-4 border">48</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Sleeves</td>
                <td className="py-2 px-4 border">22</td>
                <td className="py-2 px-4 border">22</td>
                <td className="py-2 px-4 border">23</td>
                <td className="py-2 px-4 border">23</td>
                <td className="py-2 px-4 border">23</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Arm Hole</td>
                <td className="py-2 px-4 border">8</td>
                <td className="py-2 px-4 border">8.5</td>
                <td className="py-2 px-4 border">9</td>
                <td className="py-2 px-4 border">9.5</td>
                <td className="py-2 px-4 border">10</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Shoulders</td>
                <td className="py-2 px-4 border">13</td>
                <td className="py-2 px-4 border">14</td>
                <td className="py-2 px-4 border">14.5</td>
                <td className="py-2 px-4 border">15</td>
                <td className="py-2 px-4 border">15.5</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Bust</td>
                <td className="py-2 px-4 border">17</td>
                <td className="py-2 px-4 border">18</td>
                <td className="py-2 px-4 border">20</td>
                <td className="py-2 px-4 border">22</td>
                <td className="py-2 px-4 border">23</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Hip</td>
                <td className="py-2 px-4 border">18</td>
                <td className="py-2 px-4 border">18.5</td>
                <td className="py-2 px-4 border">20.5</td>
                <td className="py-2 px-4 border">22.5</td>
                <td className="py-2 px-4 border">24</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Daman</td>
                <td className="py-2 px-4 border">19</td>
                <td className="py-2 px-4 border">19.5</td>
                <td className="py-2 px-4 border">21.5</td>
                <td className="py-2 px-4 border">23.5</td>
                <td className="py-2 px-4 border">25</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Pants (Inches)</h2>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Sizes</th>
                  <th className="py-2 px-4 text-left">XS (In)</th>
                  <th className="py-2 px-4 text-left">S (In)</th>
                  <th className="py-2 px-4 text-left">M (In)</th>
                  <th className="py-2 px-4 text-left">L (In)</th>
                  <th className="py-2 px-4 text-left">XL (In)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border">Pants Length</td>
                  <td className="py-2 px-4 border">38</td>
                  <td className="py-2 px-4 border">39</td>
                  <td className="py-2 px-4 border">39</td>
                  <td className="py-2 px-4 border">40</td>
                  <td className="py-2 px-4 border">40</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">Pants Waist</td>
                  <td className="py-2 px-4 border">30</td>
                  <td className="py-2 px-4 border">32</td>
                  <td className="py-2 px-4 border">34</td>
                  <td className="py-2 px-4 border">36</td>
                  <td className="py-2 px-4 border">38</td>
                </tr>
              </tbody>
            </table>

            <div className="px-10 py-5">
              <h1 className="text-3xl font-medium text-center uppercase p-5">
                {data.heading}
              </h1>
              {data.sections.map((section, index) => (
                <div className="py-2" key={index}>
                  <h5 className="font-semibold">{section.title}</h5>
                  <p className="text-gray-400">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
