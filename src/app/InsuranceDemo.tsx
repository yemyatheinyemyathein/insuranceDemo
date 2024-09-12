/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import CalculatedPopUpModal from "../components/CalculatedPopUpModal";

interface FormData {
  agentName: string;
  customerName: string;
  dob: string;
  age: string;
  product: string;
  term: string;
  paymentMode: string;
  calculationMode: string;
  yearPlan: string;
  amount: string;
}

const InsuranceDemo = () => {
  const [modelOpen, setMyModelOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    customerName: "",
    dob: "",
    age: "",
    product: "",
    term: "",
    paymentMode: "",
    calculationMode: "",
    yearPlan: "",
    amount: "",
  });

  const [yearPlanOptions, setYearPlanOptions] = useState<{ value: string; text: string }[]>([]);
  const [productModeOptions, setProductModeOptions] = useState<{ value: string; text: string }[]>([]);


  const productModeOptionsType1 = [
    {value: "sa", text: "SA"},
    {value: "ap", text: "AP"},
  ];
  const productModeOptionsType2 = [
    {value: "sa", text: "SA"}
  ];
  useEffect(() => {
    switch (formData.product) {
      case "0":
        setYearPlanOptions([
          { value: "5", text: "5" },
          { value: "10", text: "10" },
          { value: "15", text: "15" },
        ]);
        setProductModeOptions(productModeOptionsType1);
        break;
      case "1":
        setYearPlanOptions(
          Array.from({ length: 20 }, (_, i) => ({
            value: (i + 1).toString(),
            text: (i + 1).toString(),
          }))
        );
        setProductModeOptions(productModeOptionsType1);
        break;
      case "2":
        setYearPlanOptions([
          { value: "5", text: "5" },
          { value: "7", text: "7" },
          { value: "10", text: "10" },
        ]);
        setProductModeOptions(productModeOptionsType2);
        break;
      case "3":
        if (formData.term === "0") {
          setYearPlanOptions(
            Array.from({ length: 12 }, (_, i) => ({
              value: (i + 8).toString(),
              text: (i + 8).toString(),
            }))
          );
        } else {
          setYearPlanOptions(
            Array.from({ length: 12 }, (_, i) => ({
              value: (i + 5).toString(),
              text: (i + 5).toString(),
            }))
          );
        }
        setProductModeOptions(productModeOptionsType2);
        break;
      default:
        setYearPlanOptions([{ value: "", text: "Select plan" }]);
        setProductModeOptions(productModeOptionsType1);
        break;
    }
  }, [formData.product, formData.term]);
  

  useEffect(()=>{

    switch (formData.term) {
      case "0":
        setYearPlanOptions(
          Array.from({ length: 12 }, (_, i) => ({
            value: (i + 8).toString(),
            text: (i + 8).toString(),
          }))
        );
        break;
      case "1":
        setYearPlanOptions(
          Array.from({ length: 12 }, (_, i) => ({
            value: (i + 5).toString(),
            text: (i + 5).toString(),
          }))
        );
        break;
      default:
        break;
    }
  }, [formData.term])


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dob") {
      calculateAge(value);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    if (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)) {
      age++;
    }
    setFormData((prevData) => ({
      ...prevData,
      age: age.toString(),
    }));
  };

  const calculateSIAmount = (): number | null => {
    const { amount, paymentMode, yearPlan } = formData;
    const siAmount = parseInt(amount);
    const planValue = parseInt(yearPlan);

    if (!siAmount || !planValue) return null;

    let calculatedValue: number;

    switch (paymentMode) {
      case "0":
        calculatedValue = Math.round(siAmount / planValue);
        break;
      case "1":
        calculatedValue = Math.round(siAmount / (planValue * 12));
        break;
      case "2":
        calculatedValue = Math.round(siAmount / (planValue * 4));
        break;
      case "3":
        calculatedValue = Math.round(siAmount / (planValue * 6));
        break;
      default:
        calculatedValue = 0;
    }

    return calculatedValue;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = calculateSIAmount();
    console.log("Calculated Value:", result);
    setMyModelOpen(true);
  };

  const inputVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const getTextFromValue = (
    value: string,
    options: { value: string; text: string }[]
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.text : "";
  };

  const fieldsStep1 = [
    { label: "Agent Name", type: "text", name: "agentName", placeholder: "Type Your Name" },
    { label: "Customer Name", type: "text", name: "customerName", placeholder: "Type Your Name" },
    { label: "DOB", type: "date", name: "dob" },
    { label: "Age", type: "text", name: "age", value: formData.age, readOnly: true },
    { label: "Product", type: "select", name: "product", options: [
      { value: "", text: "Select Product" },
      { value: "0", text: "Double Flexi" },
      { value: "1", text: "Flexi health" },
      { value: "2", text: "STE" },
      { value: "3", text: "Student life" },
    ]},
  ];

  const fieldsStep2 = [
    { label: "Payment Mode", type: "select", name: "paymentMode", options: [
      { value: "", text: "Select Payment Mode" },
      { value: "0", text: "Annual" },
      { value: "1", text: "Monthly" },
      { value: "2", text: "Quarterly" },
      { value: "3", text: "Semi" },
    ]},
    { label: "Calculation Mode", type: "select", name: "calculationMode", options: productModeOptions},
    { label: "Year Plan", type: "select", name: "yearPlan", options: yearPlanOptions},
    { label: "SI Amount", type: "number", name: "amount" },
  ];
if (formData.product === "3") {
  fieldsStep2.unshift(
    { label: "Term", type: "select", name: "term", options: [
      { value: "0", text: "Premium Term" },
      { value: "1", text: "Policy Term" }
    ]},
  );
}

console.log(formData.term);

  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  const renderFields = (fields: any[]) => {
    return fields.map((field, index) => (
      <motion.div
        key={index}
        className="my-4 w-full"
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, delay: index * 0.2 }}
        variants={inputVariants}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {field.label}
        </label>
        {field.type === "select" ? (
          <select
            name={field.name}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {field.options?.map((option:any) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            placeholder={field.placeholder}
            readOnly={field.readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        )}
      </motion.div>
    ));
  };

  const getProductText = (value: string) =>
    getTextFromValue(
      value,
      fieldsStep1.find((f) => f.name === "product")?.options || []
    );
  const getPaymentModeText = (value: string) =>
    getTextFromValue(
      value,
      fieldsStep2.find((f) => f.name === "paymentMode")?.options || []
    );
  const getProductModeText = (value: string) =>
    getTextFromValue(
      value,
      fieldsStep2.find((f) => f.name === "productMode")?.options || []
    );
  const getYearPlanText = (value: string) =>
    getTextFromValue(
      value,
      fieldsStep2.find((f) => f.name === "yearPlan")?.options || []
    );

  const MyDocument = (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <Text style={styles.header}>Insurance Calculation Report</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {[...fieldsStep1, ...fieldsStep2].map((field) => (
              <Text
                style={[styles.tableCell, styles.tableHeader]}
                key={field.name}
              >
                {field.label}
              </Text>
            ))}
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Premium Amount
            </Text>
          </View>
          <View style={styles.tableRow}>
            {Object.entries(formData).map(([key, value]) => (
              <Text style={styles.tableCell} key={key}>
                {value}
              </Text>
            ))}
            <Text style={styles.tableCell}>{calculateSIAmount()}</Text>
          </View>
        </View>
        <Text style={styles.footer}>Agent Name: {formData.agentName}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="md:w-[80%] mx-auto p-6">
      <p className="text-xl font-semibold">Insurance Calculation</p>
      <form onSubmit={handleSubmit}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={inputVariants}
          className="w-full"
        >
          {currentStep === 1 && renderFields(fieldsStep1)}
          {currentStep === 2 && renderFields(fieldsStep2)}
        </motion.div>

        {currentStep === 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-2 px-4 bg-yellow-400 font-semibold text-white rounded-lg mt-4"
          >
            Next
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 px-4 bg-gray-500 font-semibold text-white rounded-lg mt-4"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-400 font-semibold text-white rounded-lg mt-4"
            >
              Submit
            </button>
          </>
        )}
      </form>
      {modelOpen && (
        <CalculatedPopUpModal
        data={{
          ...formData,
          product: getProductText(formData.product),
          paymentMode: getPaymentModeText(formData.paymentMode),
          calculationMode: getProductModeText(formData.calculationMode),
          yearPlan: getYearPlanText(formData.yearPlan),
        }}
        modelOpen={modelOpen}
        setModelOpen={setMyModelOpen}
        calculatedValue={calculateSIAmount()}
        MyDocument={MyDocument}
        studentLifeExtra={formData.product === "3"}
      />
      )}
    </div>
  );
};

export default InsuranceDemo;

const styles = StyleSheet.create({
  body: {
    padding: 10,
  },
  header: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 20,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});
