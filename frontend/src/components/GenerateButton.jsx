import { BsLightningChargeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";

const GenerateButton = ({ onClick, generating, loading }) => (
  <button
    onClick={onClick}
    disabled={generating || loading}
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-sm"
  >
    {generating ? (
      <>
        <ImSpinner8 className="animate-spin w-4 h-4" /> Generating…
      </>
    ) : (
      <>
        <BsLightningChargeFill className="w-4 h-4" /> Generate
      </>
    )}
  </button>
);

export default GenerateButton;