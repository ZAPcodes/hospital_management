export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
  
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      </>
    );
  }
  
  