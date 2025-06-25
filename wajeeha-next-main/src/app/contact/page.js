import Layout from "@/utilities/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center p-10">
        <div className="flex flex-col md:flex-row justify-center items center my-10">
          <div className="w-full md:w-2/4 contact-from flex flex-col items-start justify-center shadow-lg border rounded-lg py-10">
            <h5 className="text-xl font-medium text-start uppercase mb-10 px-20">
              GET IN TOUCH
            </h5>
            <form className="w-full px-20">
              <div className="w-full name mb-10">
                <label for="name">Your Name (required)</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border-b border-black hover:outline-none active:outline-none outline-none py-2"
                />
              </div>

              <div className="w-full email mb-10">
                <label for="email">Your Email (required)</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border-b border-black hover:outline-none active:outline-none outline-none py-2"
                />
              </div>

              <div className="w-full phone mb-10">
                <label for="number">Your Phone Number</label>
                <input
                  type="number"
                  name="phone"
                  className="w-full border-b border-black hover:outline-none active:outline-none outline-none py-2"
                />
              </div>

              <div className="w-full message mb-10">
                <label for="message">Your Message (required)</label>
                <textarea
                  name="message"
                  rows="4"
                  className="w-full border-b border-black hover:outline-none active:outline-none outline-none py-2"
                />
              </div>

              <button className="bg-black font-bold text-white rounded-full border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all duration-300 ease-in-out py-3 px-10">
                Submit
              </button>
            </form>
          </div>
          <div className="w-full md:w-2/4 contact-info flex flex-col items-start justify-start px-5 py-10">
            <h5 className="text-xl font-medium text-center uppercase mb-10">
              CONTACT INFORMATION
            </h5>
            <p>
              We love to hear from you on our customer service, merchandise,
              website or any topics you want to share with us. Your comments and
              suggestions will be appreciated. Please complete the form below.
            </p>
            <br />
            <ul className="flex flex-col gap-3 list-disc ml-10">
              <li>
                <a href="tel:+923020010434" className="text-blue-500 underline">
                  tel: +92 302 0010434
                </a>
              </li>
              <li>
                <a href="mailto: wajeehahashmi1995@gmail.com" className="text-blue-500 underline">
                  wajeehahashmi1995@gmail.com
                </a>
              </li>
              <li>Everyday 9:00 AM to 10:00 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
