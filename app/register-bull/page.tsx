import dynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ Lazy load form (BIG SPEED BOOST)
const RegisterBullForm = dynamic(
  () => import("@/components/RegisterBullForm"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-10 text-gray-500">
        फॉर्म लोड होत आहे...
      </div>
    ),
  }
);

export default function RegisterBullPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Heading – same UI */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              तुमचा बैल नोंदवा
            </h1>
            <p className="text-lg text-gray-600">
              तुमच्या बैलाची माहिती भरून त्याला विक्रीसाठी सूचीबद्ध करा
            </p>
          </div>

          {/* ✅ Form container – same design */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <Suspense fallback={null}>
              <RegisterBullForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
