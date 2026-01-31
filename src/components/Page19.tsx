import { Shield, FileText, Scale } from 'lucide-react';

interface Page19Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page19({ onNext, onBack }: Page19Props) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-purple-400 text-center flex items-center justify-center gap-3">
          <Shield className="w-12 h-12" />
          Terms of Service & Disclaimer
        </h1>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-10 h-10 text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-300">Terms of Service</h2>
          </div>

          <div className="space-y-4 text-purple-100 leading-relaxed">
            <p className="text-lg">
              <strong className="text-purple-300">1. Acceptance of Terms:</strong> By accessing and using MandaStrong Studio, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">2. User Content Ownership:</strong> All content created using MandaStrong Studio's AI tools is owned by you, the user. You retain full intellectual property rights to your creative works. We do not claim any ownership of content you generate.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">3. Acceptable Use:</strong> You agree to use this platform for lawful purposes only. Users must respect intellectual property rights and not create content that infringes on copyrights, trademarks, or other proprietary rights of third parties.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">4. Service Availability:</strong> While we strive to maintain 24/7 availability, MandaStrong Studio reserves the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">5. Payment & Subscriptions:</strong> Subscription fees are billed monthly. All payments are processed securely through Stripe. Refunds are handled on a case-by-case basis.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">6. Privacy:</strong> We respect your privacy and handle your data in accordance with applicable privacy laws. Your projects and creative content remain private unless you choose to share them in our Community Hub.
            </p>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-600 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-10 h-10 text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-300">Disclaimer</h2>
          </div>

          <div className="space-y-4 text-purple-100 leading-relaxed">
            <p className="text-lg">
              <strong className="text-purple-300">AI-Generated Content:</strong> MandaStrong Studio utilizes artificial intelligence to assist in content creation. While our AI tools are powerful, AI-generated content should always be reviewed, edited, and verified before distribution or commercial use.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">User Responsibility:</strong> Users are solely responsible for ensuring their final productions comply with all local, state, federal, and international laws and regulations. This includes but is not limited to copyright law, defamation law, and privacy regulations.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">No Warranties:</strong> The service is provided "as is" without warranties of any kind, either express or implied. MandaStrong Studio makes no guarantees regarding the accuracy, reliability, or quality of AI-generated content.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">Limitation of Liability:</strong> MandaStrong Studio, its creators, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">Content Review:</strong> You acknowledge that AI tools may occasionally produce unexpected results. It is your responsibility to review all content before publishing, sharing, or using it commercially.
            </p>

            <p className="text-lg">
              <strong className="text-purple-300">Educational Purpose:</strong> This platform is designed to empower creativity and education. We provide tools for storytelling and content creation that can educate, inspire, and make a positive impact on the world.
            </p>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6 text-center mb-8">
          <p className="text-purple-200 text-lg mb-4">
            By continuing to use MandaStrong Studio, you acknowledge that you have read, understood, and agree to these Terms of Service and Disclaimer.
          </p>
          <p className="text-purple-400 font-bold text-xl">
            Last Updated: January 2025
          </p>
        </div>

        <div className="flex gap-4 justify-center">
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
            Next
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center text-white text-sm">
          <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>
    </div>
  );
}
