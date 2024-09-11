import React from 'react';
import Modal from 'react-modal';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface FormData {
  agentName: string;
  customerName: string;
  dob: string;
  age: string;
  product: string;
  paymentMode: string;
  calculationMode: string;
  yearPlan: string;
  term: string;
  amount: string;
}

interface CalculatedPopUpModalProps {
  data: FormData;
  modelOpen: boolean;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calculatedValue: number | null;
  MyDocument: JSX.Element;
  studentLifeExtra: boolean;
}

const CalculatedPopUpModal: React.FC<CalculatedPopUpModalProps> = ({
  data,
  modelOpen,
  setModelOpen,
  calculatedValue,
  MyDocument,
  studentLifeExtra
}) => {
  if (!modelOpen) return null;

  return (
    <Modal
      isOpen={modelOpen}
      onRequestClose={() => setModelOpen(false)}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        <button
          onClick={() => setModelOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Calculated Result</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculation Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                {studentLifeExtra && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.agentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.dob}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.paymentMode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.calculationMode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.yearPlan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.amount}</td>
                {studentLifeExtra && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.term}</td>}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculatedValue !== null ? calculatedValue : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center items-center bg-yellow-400 text-white rounded-lg p-2">
          <PDFDownloadLink document={MyDocument} fileName="insurance-report.pdf">
            {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
          </PDFDownloadLink>
        </div>
      </div>
    </Modal>
  );
};

export default CalculatedPopUpModal;
