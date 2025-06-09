export default function ShipmentDetailLoading() {
  return (
    <div className="p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-8 w-24 bg-gray-200 rounded mr-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Shipment details card skeleton */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="h-7 w-48 bg-gray-200 rounded mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start">
                <div className="h-5 w-5 bg-gray-200 rounded-full mr-3 mt-0.5"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Items table skeleton */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-7 w-36 bg-gray-200 rounded"></div>
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
          </div>

          <div className="overflow-x-auto">
            <div className="h-10 w-full bg-gray-200 rounded mb-2"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-gray-200 rounded mb-2"></div>
            ))}
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
