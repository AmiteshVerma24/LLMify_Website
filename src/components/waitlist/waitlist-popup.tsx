interface WaitingListPopupProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export const WaitingListPopup: React.FC<WaitingListPopupProps> = ({
    isOpen,
    onClose,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-w-md w-full bg-[#14141a] text-white rounded-xl shadow-lg p-6">
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            &#x2715;
          </button>
          {/* Tickmark */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Main text */}
            <h2 className="text-2xl font-semibold text-center">
              We've added you to our waiting list!
            </h2>
            <p className="text-center text-gray-400">
              We’ll let you know when SmartSnip is ready.
            </p>
          </div>
        </div>
      </div>
    );
  };
  