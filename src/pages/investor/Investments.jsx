import React, { useState } from "react";

const Investments = () => {
    const [step, setStep] = useState(1); // ১: ইনপুট, ২: পেমেন্ট পেন্ডিং, ৩: সাকসেস
    const [loading, setLoading] = useState(false);
    const [investmentData, setInvestmentData] = useState(null);

    // ১. ইনভেস্টমেন্ট ইনিশিয়েট করা (Back-end: /api/v1/investments/initiate/)
    const handleInitiate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            project_id: "1f789094-861f-4113-b22e-f551c5758f41", // উদাহরণ আইডি
            shares_requested: 12,
            idempotency_key: `key-${Date.now()}` // ইউনিক কি
        };

        try {
            // আসল এপিআই কল এখানে হবে
            // const res = await axios.post('/api/v1/investments/initiate/', payload);

            // ডামি সাকসেস রেসপন্স (আপনার ব্যাকএন্ড অনুযায়ী)
            setTimeout(() => {
                setInvestmentData({
                    reference_id: payload.idempotency_key,
                    payment_url: "https://sandbox.payment.gateway/pay?ref=tv213"
                });
                setStep(2);
                setLoading(false);
            }, 1500);
        } catch (error) {
            alert("Initiation failed!");
            setLoading(false);
        }
    };

    // ২. পেমেন্ট কনফার্মেশন সিমুলেশন (Back-end: /api/v1/investments/payments/callback/)
    const handleCallback = () => {
        setLoading(true);
        // এখানে ব্যাকএন্ডে গেটওয়ে থেকে আসা ডেটা পাঠানো হয়
        setTimeout(() => {
            setStep(3);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Invest Now</h1>
                    <p className="text-indigo-100 text-sm">Secure Asset Investment</p>
                </div>

                <div className="p-8">
                    {/* Step 1: Input Amount */}
                    {step === 1 && (
                        <div className="animate-fadeIn">
                            <label className="block text-gray-700 font-semibold mb-2">Number of Shares</label>
                            <input
                                type="number"
                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 outline-none transition"
                                placeholder="Enter shares (e.g. 12)"
                            />
                            <button
                                onClick={handleInitiate}
                                disabled={loading}
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95"
                            >
                                {loading ? "Processing..." : "Initiate Investment"}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment Gateway Redirect */}
                    {step === 2 && (
                        <div className="text-center animate-slideIn">
                            <div className="mb-4 text-amber-500">
                                <svg className="w-16 h-16 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Payment Required</h2>
                            <p className="text-gray-500 mt-2 text-sm">Reference: {investmentData?.reference_id}</p>

                            <a
                                href={investmentData?.payment_url}
                                target="_blank"
                                className="block w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-center transition shadow-lg"
                            >
                                Pay with Gateway
                            </a>

                            <button
                                onClick={handleCallback}
                                className="mt-4 text-xs text-gray-400 hover:underline"
                            >
                                Simulating Success Callback? Click here.
                            </button>
                        </div>
                    )}

                    {/* Step 3: Success Allocation */}
                    {step === 3 && (
                        <div className="text-center animate-successPop">
                            <div className="mb-4 text-green-500">
                                <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Investment Success!</h2>
                            <p className="text-gray-600 mt-2">Shares have been allocated to your account.</p>
                            <button
                                onClick={() => setStep(1)}
                                className="mt-8 text-indigo-600 font-semibold border-b-2 border-indigo-600"
                            >
                                Back to History
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes successPop { 0% { transform: scale(0.8); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-slideIn { animation: slideIn 0.5s ease-out; }
                .animate-successPop { animation: successPop 0.4s ease-out; }
            `}} />
        </div>
    );
};

export default Investments;