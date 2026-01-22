import { memo } from "react";
import * as constants from "../../utils/Constants";
import browseComputerImg from "../../assets/computer.png";
import InvestImg from "../../assets/invest.png";
import EarnImg from "../../assets/money.png";
import { motionHoverScale } from "../../utils/helperFunctions/helperFunctions";

const steps = [
  {
    imgSrc: browseComputerImg,
    title: constants.HOWITWORKS_STEP_1_TITLE || "Browse",
    subtitle: "STEP 01",
    description: constants.HOWITWORKS_STEP_1_DESCRIPTION || "Discover innovative startups easily.",
  },
  {
    imgSrc: InvestImg,
    title: constants.HOWITWORKS_STEP_2_TITLE || "Invest",
    subtitle: "STEP 02",
    description: constants.HOWITWORKS_STEP_2_DESCRIPTION || "Securely commit your capital.",
  },
  {
    imgSrc: EarnImg,
    title: constants.HOWITWORKS_STEP_3_TITLE || "Earn",
    subtitle: "STEP 03",
    description: constants.HOWITWORKS_STEP_3_DESCRIPTION || "Watch your portfolio grow.",
  },
];

const HowItWork = () => {
  return (
    <section
      id="how-it-works"
      className="w-full bg-[#020617] text-white py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Compact Header */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
            {constants.HOWITWORKS_HEADING_TEXT || "How It Works"}
          </h2>
          <div className="h-[1px] w-full bg-slate-800" />
        </div>

        {/* Tight Steps List */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Smaller 3D Image Wrapper */}
              <div className="w-full md:w-1/3 flex justify-center">
                {motionHoverScale(
                  <div className="relative group p-4 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-xl">
                    <img
                      src={step.imgSrc}
                      className="w-48 md:w-56 h-auto transform group-hover:-translate-y-2 transition-transform duration-300"
                      alt={step.title}
                    />
                    {/* Compact Step Badge */}
                    <div className="absolute -top-3 -left-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                      {step.subtitle}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-snug max-w-sm mx-auto md:mx-0">
                  {step.description}
                </p>
                <div className="pt-2 flex justify-center md:justify-start">
                  <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HowItWork);