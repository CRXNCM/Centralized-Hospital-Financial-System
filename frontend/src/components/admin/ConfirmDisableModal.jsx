export default function ConfirmDisableModal({ channelLabel, onConfirm, onCancel }) {
  if (!channelLabel) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onCancel}
      />
      <div
        className="modal-panel relative z-10 w-full max-w-md rounded-2xl border border-[rgba(34,211,238,0.25)] bg-[#112240] p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-lg font-bold text-white">Disable payment channel?</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
          Are you sure you want to disable{" "}
          <span className="font-semibold text-white">{channelLabel}</span>? Reception will no
          longer be able to record payments through this channel.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-[rgba(34,211,238,0.35)] px-5 py-2.5 text-sm font-semibold text-[#22D3EE]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#F43F5E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#fb7185]"
          >
            Disable
          </button>
        </div>
      </div>
    </div>
  );
}
