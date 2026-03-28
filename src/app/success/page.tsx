import Link from "next/link";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-brand-950 mb-3">
          Purchase Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Your template is ready for download. Check your email for the download
          link, or click below to download now.
        </p>
        <div className="space-y-3">
          <button className="btn-primary w-full flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Template
          </button>
          <Link
            href="/templates"
            className="btn-secondary w-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Browse More Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
