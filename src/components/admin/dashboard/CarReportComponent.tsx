import React from "react";

const ReportPage = () => {
  const downloadReport = async () => {
    try {
      const response = await fetch("/api/dashboard/report");
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rentals_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Rental Report</h1>
      <button
        onClick={downloadReport}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Download Report (CSV)
      </button>
    </div>
  );
};

export default ReportPage;
