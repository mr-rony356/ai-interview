"use client";

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-4xl font-bold md:text-5xl">
          Get in touch. <span className="font-normal">It's free.</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium uppercase text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="surname"
                className="block text-sm font-medium uppercase text-gray-600"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                placeholder="Surname"
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium uppercase text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full rounded-sm border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium uppercase text-gray-600"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={8}
              placeholder="Type your message here ..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-sm bg-blue-600 px-8 py-4 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
