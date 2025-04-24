"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Phone, Mail, FileText, Send, HelpCircle, AlertCircle } from "lucide-react"

export default function SupportPage() {
  const [supportMessage, setSupportMessage] = useState("")
  const [supportCategory, setSupportCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Success state
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setSupportMessage("")
    setSupportCategory("")

    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
    }, 5000)
  }

  const faqItems = [
    {
      question: "Question 1",
      answer:
        "Lorem Ipsum ",
    },
    {
      question: "Question 2",
      answer:
        "Lorem Ipsum",
    },
    {
      question: "Question 3",
      answer:
        "Lorem Ipsum",
    },
  ]

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Support Center</h1>
        <p className="text-gray-600">Get help with your shipments and account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        

        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Phone className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Call Us</h3>
              <p className="text-sm text-gray-600">Mon-Fri, 9am-5pm</p>
              <p className="mt-2 text-green-600 font-medium">+61 xxxxxxxx</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Mail className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Email Support</h3>
              <p className="text-sm text-gray-600">24/7 email support</p>
              <p className="mt-2 text-purple-600 font-medium">support@example.com.au</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-md text-blue-700">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-semibold text-black">Submit a Support Request</h2>
          </div>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Request Submitted</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Thank you for contacting us. Our support team will respond to your inquiry within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="w-full border border-gray-300 text-black rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="shipment">Shipment Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full border border-gray-300 text-black rounded-md py-2 px-3 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-md text-yellow-700">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-lg font-semibold text-black">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-black mb-2">{item.question}</h3>
                <p className="text-gray-600 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
            >
              View All FAQs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
