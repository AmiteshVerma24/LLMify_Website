interface WaitingListPopupProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string; // Optional custom message
  }
  
  export const WaitingListFailurePopup: React.FC<WaitingListPopupProps> = ({
    isOpen,
    onClose,
    message = "Something went wrong", // Default text
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-w-md w-full bg-[#14141a] text-white rounded-xl shadow-lg p-6">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            &#x2715;
          </button>
          {/* Cross Icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {/* Main Text */}
            <h2 className="text-2xl font-semibold text-center">{message}</h2>
          </div>
        </div>
      </div>
    );
  };
  