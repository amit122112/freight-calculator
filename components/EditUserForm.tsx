// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { ArrowLeft, Mail, User, MapPin, Phone, Building, Percent } from "lucide-react"
// import Link from "next/link"
// import { API_TOKEN } from "@/lib/config"

// const countryCodes: Record<string, string> = {
//   Australia: "+61",
// }

// const australianStates = [
//   "New South Wales",
//   "Victoria",
//   "Queensland",
//   "Western Australia",
//   "South Australia",
//   "Tasmania",
//   "Australian Capital Territory",
//   "Northern Territory",
// ]

// export default function EditUserPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const userId = searchParams?.get("id") || null

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "Victoria",
//     zipCode: "",
//     country: "Australia",
//     phone: "",
//     role: "user",
//     company: "",
//     status: "active",
//     commission: "",
//   })

//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     if (!userId) return

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`https://www.hungryblogs.com/api/GetUser/?id=${userId}`, {
//           headers: {
//             Authorization: API_TOKEN,
//             Accept: "application/json",
//           },
//         })

        

//         if (!res.ok) throw new Error("Failed to fetch user")

//         const data = await res.json()
        
//         const u = Array.isArray(data.details) ? data.details[0] : data.details

//         if (!u) {
//           console.error("User not found")
//           setIsLoading(false)
//           return
//         }

//         setFormData({
//           firstName: u.first_name || "",
//           lastName: u.last_name || "",
//           email: u.email || "",
//           address: u.address || "",
//           city: u.city || "",
//           state: u.state || "Victoria",
//           zipCode: u.zip_code || "",
//           country: u.country || "Australia",
//           phone: u.phone || "",
//           role: u.user_role || "user",
//           company: u.company || "",
//           status: u.user_status || "active",
//           commission: u.commission?.toString() || "",
//         })
//         setIsLoading(false)
//       } catch (err) {
//         console.error("Error loading user:", err)
//         setIsLoading(false)
//       }
//     }

//     fetchUser()
//   }, [userId])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target

//     if (name === "country" && value === "Australia") {
//       setFormData((prev) => ({ ...prev, phone: `${countryCodes[value]} `, [name]: value }))
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("User update submitted", formData)
//   }

//   //if (isLoading) return <p className="text-center text-gray-600">Loading user data...</p>

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
//       <div className="flex items-center mb-6">
//         <Link href="/admin/users" className="text-blue-600 hover:underline flex items-center">
//           <ArrowLeft size={18} className="mr-1" /> Back to Users
//         </Link>
//       </div>
//       <h2 className="text-2xl font-bold text-black mb-4">Edit User</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="relative">
//             <User className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400" size={16} />
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="First Name"
//               className="pl-8 border p-2 rounded text-black w-full"
//               required
//             />
//           </div>
//           <div className="relative">
//             <User className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400" size={16} />
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Last Name"
//               className="pl-8 border p-2 rounded text-black w-full"
//             />
//           </div>
//         </div>

//         <div className="relative">
//           <Mail className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400" size={16} />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="pl-8 border p-2 w-full rounded text-black"
//             required
//           />
//         </div>

//         {/* Remaining form unchanged */}

//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   )
// }
