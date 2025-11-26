import { FileText, Shield } from 'lucide-react';

interface Page18Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page18({ onNext, onBack }: Page18Props) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-purple-400 flex items-center gap-3">
          <FileText className="w-10 h-10" />
          Terms of Service & Disclaimer
        </h1>

        <div className="space-y-6">
          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-300">
              <Shield className="w-6 h-6" />
              Terms of Service
            </h2>
            <div className="space-y-4 text-purple-200">
              <p>
                <strong>1. Acceptance of Terms:</strong> By using MandaStrong Studio, you agree to these Terms of Service. If you do not agree, please do not use this service.
              </p>
              <p>
                <strong>2. User Content:</strong> You retain all rights to the content you create using MandaStrong Studio. You are solely responsible for the content you generate.
              </p>
              <p>
                <strong>3. Acceptable Use:</strong> You may not use this service to create content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.
              </p>
              <p>
                <strong>4. Service Availability:</strong> We strive to provide continuous service but do not guarantee uninterrupted access. The service is provided "as is" without warranties.
              </p>
              <p>
                <strong>5. Intellectual Property:</strong> All AI tools, interface designs, and MandaStrong Studio branding are intellectual property of MandaStrong1.
              </p>
              <p>
                <strong>6. Privacy:</strong> We respect your privacy. User data is stored securely and will not be shared without consent.
              </p>
              <p>
                <strong>7. Modifications:</strong> We reserve the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.
              </p>
            </div>
          </div>

          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              ⚠️ Disclaimer
            </h2>
            <div className="space-y-4 text-purple-200">
              <p>
                <strong>AI-Generated Content:</strong> This platform uses AI technology to assist in movie creation. Results may vary and are not guaranteed to meet specific expectations.
              </p>
              <p>
                <strong>No Warranty:</strong> MandaStrong Studio is provided WITHOUT WARRANTY of any kind, either express or implied, including but not limited to fitness for a particular purpose.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> MandaStrong1 shall not be liable for any damages arising from use of this service, including but not limited to data loss, project corruption, or service interruptions.
              </p>
              <p>
                <strong>Third-Party Services:</strong> We may integrate with third-party AI services. We are not responsible for their performance or availability.
              </p>
              <p>
                <strong>Copyright Compliance:</strong> Users are responsible for ensuring their content does not infringe on copyrights or other intellectual property rights.
              </p>
              <p>
                <strong>Educational Purpose:</strong> This tool is designed for creative and educational purposes. Professional use requires user verification of output quality.
              </p>
              <p className="text-purple-400 font-bold mt-6">
                BY USING MANDASTRONG STUDIO, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO THESE TERMS AND DISCLAIMERS.
              </p>
            </div>
          </div>

          <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-300">
              Contact & Support
            </h2>
            <p className="text-green-200 mb-4">
              For questions, support, or concerns regarding these terms, please visit:
            </p>
            <a
              href="https://MandaStrong1.Etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 underline font-bold"
            >
              MandaStrong1.Etsy.com
            </a>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            I Agree - Continue
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center text-white text-sm">
          <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>
    </div>
  );
}
