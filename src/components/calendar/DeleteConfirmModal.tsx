'use client';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  eventTitle: string;
}

export default function DeleteConfirmModal({ onConfirm, onCancel, eventTitle }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1d21] rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Delete Event</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete &quot;{eventTitle}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-[#2d3238] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 