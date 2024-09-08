import React, { useState, ChangeEvent, FormEvent } from "react";
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
  name: string;
  dob: string;
  age: string;
  product: string;
  paymentMode: string;
  productMode: string;
  yearPlan: string;
  amount: string;
}

interface InsuranceDemoProps {
  username: string;
}

const InsuranceDemo: React.FC<InsuranceDemoProps> = ({ username }) => {
  const [modelOpen, setMyModelOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    age: "",
    product: "",
    paymentMode: "",
    productMode: "",
    yearPlan: "",
    amount: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const getTextFromValue = (
    value: string,
    options: { value: string; text: string }[]
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.text : "";
  };
  

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = calculateSIAmount();
    console.log("Calculated Value:", result);
    setMyModelOpen(true);
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fields = [
    {
      label: "Name",
      type: "text",
      name: "name",
      placeholder: "Type Your Name",
    },
    { label: "DOB", type: "date", name: "dob" },
    {
      label: "Age",
      type: "text",
      name: "age",
      value: formData.age,
      readOnly: true,
    },
    {
      label: "Product",
      type: "select",
      name: "product",
      options: [
        { value: "", text: "Select Product" },
        { value: "0", text: "Double Flexi" },
        { value: "1", text: "Flexi health" },
        { value: "2", text: "STE" },
        { value: "3", text: "Student life" },
      ],
    },
    {
      label: "Payment Mode",
      type: "select",
      name: "paymentMode",
      options: [
        { value: "", text: "Select Payment Mode" },
        { value: "0", text: "Annual" },
        { value: "1", text: "Monthly" },
        { value: "2", text: "Quarterly" },
        { value: "3", text: "Semi" },
      ],
    },
    {
      label: "Product Mode",
      type: "select",
      name: "productMode",
      options: [
        { value: "", text: "Select Product Mode" },
        { value: "sa", text: "SA" },
        { value: "ap", text: "AP" },
      ],
    },
    {
      label: "Year Plan",
      type: "select",
      name: "yearPlan",
      options: [
        { value: "", text: "Select plan" },
        { value: "1", text: "1" },
        { value: "5", text: "5" },
        { value: "10", text: "10" },
        { value: "15", text: "15" },
      ],
    },
    { label: "SI Amount", type: "number", name: "amount" },
  ];

  const getProductText = (value: string) =>
    getTextFromValue(
      value,
      fields.find((f) => f.name === "product")?.options || []
    );
  const getPaymentModeText = (value: string) =>
    getTextFromValue(
      value,
      fields.find((f) => f.name === "paymentMode")?.options || []
    );
  const getProductModeText = (value: string) =>
    getTextFromValue(
      value,
      fields.find((f) => f.name === "productMode")?.options || []
    );
  const getYearPlanText = (value: string) =>
    getTextFromValue(
      value,
      fields.find((f) => f.name === "yearPlan")?.options || []
    );

  const MyDocument = (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <Text style={styles.header}>Insurance Calculation Report</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {fields.map((field) => (
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
                {key === "product"
                  ? getProductText(value)
                  : key === "paymentMode"
                  ? getPaymentModeText(value)
                  : key === "productMode"
                  ? getProductModeText(value)
                  : key === "yearPlan"
                  ? getYearPlanText(value)
                  : value}
              </Text>
            ))}
            <Text style={styles.tableCell}>{calculateSIAmount()}</Text>
          </View>
        </View>
        <Text style={styles.footer}>Agent Name: {username}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="md:w-[80%] mx-auto p-6">
      <p className="text-xl font-semibold">Insurance Calculation</p>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <motion.div
            key={index}
            className="my-4 w-full"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.3 }}
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
                {field.options?.map((option) => (
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
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 font-semibold text-white rounded-lg mt-4"
        >
          Calculate
        </button>
      </form>

      {modelOpen && (
        <CalculatedPopUpModal
        data={{
          ...formData,
          product: getProductText(formData.product),
          paymentMode: getPaymentModeText(formData.paymentMode),
          productMode: getProductModeText(formData.productMode),
          yearPlan: getYearPlanText(formData.yearPlan),
        }}
        modelOpen={modelOpen}
        setModelOpen={setMyModelOpen}
        calculatedValue={calculateSIAmount()}
        MyDocument={MyDocument}
        username={username}
      />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 2,
    fontSize: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 20,
  },
});

export default InsuranceDemo;