import React from "react";

const Alert = ({showAlert, setShowAlert}: {showAlert: string, setShowAlert: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
        <>
            {showAlert ? (
                <div
                    className={
                        "text-white px-6 py-4 border-0 rounded relative mb-4 bg-red"
                    }
                >
          <span className="text-xl inline-block mr-5 align-middle">
            <i className="fas fa-bell" />
          </span>
                    <span className="inline-block align-middle mr-8">
                        {showAlert}
          </span>
                    <button
                        className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                        onClick={() => setShowAlert("")}
                    >
                        <span>×</span>
                    </button>
                </div>
            ) : null}
        </>
    );
};

export default function ClosingAlert({showAlert, setShowAlert}: {showAlert: string, setShowAlert: React.Dispatch<React.SetStateAction<string>>}) {
    return (
        <>
            <Alert showAlert={showAlert} setShowAlert={setShowAlert} />
        </>
    );
}
