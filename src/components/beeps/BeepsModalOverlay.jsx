import { useBeepsDetail } from "../../context/BeepsDetailContext.jsx";
import BeepsModal from "./BeepsModal.jsx";

export default function BeepsModalOverlay() {
  const { beeps, isOpen, activeIndex, closeBeeps } = useBeepsDetail();

  if (!isOpen || !beeps?.length) return null;

  return (
    <BeepsModal
      beeps={beeps}
      initialIndex={activeIndex}
      onClose={closeBeeps}
    />
  );
}