import Image from "next/image";
import Link from "next/link";

const offices = [
  {
    city: "Barcelona",
    image: "/office-1.jpg",
    address: "434 Broadway, Floor 3 New York NY",
    postalCode: "10013 United States",
  },
  {
    city: "New York",
    image: "/office-2.jpg",
    address: "434 Broadway, Floor 3 New York NY",
    postalCode: "10013 United States",
  },
  {
    city: "Amsterdam",
    image: "/office-3.jpg",
    address: "434 Broadway, Floor 3 New York NY",
    postalCode: "10013 United States",
  },
];

export default function Offices() {
  return (
    <section className="bg-[#f8f8f8] py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">Our Offices</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office) => (
            <Link
              key={office.city}
              href="#"
              className="relative h-[450px] overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-2"
            >
              <Image
                src={office.image || "/placeholder.svg"}
                alt={`${office.city} office`}
                fill
                className="object-cover transition-opacity duration-300 "
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-black/50 transition-all duration-300 " />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
                <h3 className="mb-2 text-2xl font-semibold">{office.city}</h3>
                <p className="text-sm opacity-90">
                  {office.address}
                  <br />
                  {office.postalCode}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
