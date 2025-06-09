export default function Loading() {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
