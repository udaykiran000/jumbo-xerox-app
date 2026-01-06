import PriceCard from "../../components/common/PriceCard";
import QuickPrintForm from "../../components/quickprint/QuickPrintForm";

export default function Services() {
  return (
    <div className="w-full">
      {/* ===== QUICK PRINT SECTION ===== */}
      <div className="border-t bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* 🔥 FULL QUICK PRINT COMPONENT */}
          <QuickPrintForm />
        </div>
      </div>
      {/* ===== PRICING SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Our Services & Pricing
        </h1>

        <p className="text-center text-gray-600 mb-12">
          Transparent pricing. No hidden charges.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PriceCard
            title="Black & White (A4)"
            price="₹2.00"
            sub="per page"
            features={["75 GSM Paper", "Laser Quality", "Both Sides Available"]}
          />

          <PriceCard
            title="Color Print (A4)"
            price="₹10.00"
            sub="per page"
            features={["High Quality Bond", "Vivid Colors", "Images & Text"]}
            bg="bg-blue-50 border-blue-200"
          />

          <PriceCard
            title="Spiral Binding"
            price="₹40.00"
            sub="per book"
            features={[
              "Plastic Sheet Cover",
              "Durable Coil",
              "Up to 300 pages",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
