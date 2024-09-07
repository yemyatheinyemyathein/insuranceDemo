import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const InsuranceDemo = ({ username }) => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    product: "",
    paymentMode: "",
    yearPlan: "",
    amount: "",
  });
  const [isCalculated, setIsCalculated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dob") {
      calculateAge(value);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setFormData((prevData) => ({
      ...prevData,
      age: age.toString(),
    }));
  };

  const calculateSIAmount = () => {
    const { amount, product, yearPlan } = formData;
    const siAmount = parseInt(amount);
    const planValue = parseInt(yearPlan);

    if (!siAmount || !planValue) return null;

    let calculatedValue;

    switch (product) {
      case "0": // Annual
        calculatedValue = siAmount / planValue;
        break;
      case "1": // Monthly
        calculatedValue = siAmount / (planValue * 12);
        break;
      case "2": // Quarterly
        calculatedValue = siAmount / (planValue * 4);
        break;
      case "3": // Semi
        calculatedValue = siAmount / (planValue * 6);
        break;
      default:
        calculatedValue = null;
    }

    return calculatedValue;
  };

  const productPDFData = () => {
    const { product } = formData;
    let data;

    switch (product) {
      case "0": // Annual
        data = "Annual";
        break;
      case "1": // Monthly
        data = "Monthly";
        break;
      case "2": // Quarterly
        data = "Quarterly";
        break;
      case "3": // Semi
        data = "Semi";
        break;
      default:
        data = null;
    }

    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = calculateSIAmount();
    console.log("Calculated Value:", result);
    setIsCalculated(true);
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const MyDocument = (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header}>Insurance Calculation Report</Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{formData.name}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{formData.dob}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{formData.age}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Product:</Text>
          <Text style={styles.value}>{productPDFData()}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{formData.paymentMode}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Year Plan:</Text>
          <Text style={styles.value}>{formData.yearPlan}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{formData.amount}</Text>
        </Text>

        <Text style={styles.data}>
          <Text style={styles.label}>Calculated Value:</Text>
          <Text style={styles.value}>{calculateSIAmount()}</Text>
        </Text>

        <Text style={styles.footer}>Agent Name: {username}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="md:w-[80%] mx-auto p-6">
      <p className="text-xl font-semibold">Insurance Calculation</p>

      <form onSubmit={handleSubmit}>
        {[
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
              { value: "0", text: "Annual" },
              { value: "1", text: "Monthly" },
              { value: "2", text: "Quarterly" },
              { value: "3", text: "Semi" },
            ],
          },
          {
            label: "Payment Mode",
            type: "select",
            name: "paymentMode",
            options: [
              { value: "", text: "Select Payment Mode" },
              { value: "SA", text: "SA" },
              { value: "AP", text: "AP" },
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
        ].map((field, index) => (
          <motion.div
            key={index}
            className="my-4 w-full"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.3 }}
            variants={inputVariants}
          >
            <label htmlFor={field.name} className="block mb-2">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-2 px-2 rounded border border-gray-400"
              >
                {field.options.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-2 rounded outline-none px-2 border border-gray-400"
                readOnly={field.readOnly}
              />
            )}
          </motion.div>
        ))}

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 7 * 0.3 }}
          variants={inputVariants}
          className="flex justify-end items-center"
        >
          <button
            type="submit"
            className="bg-yellow-400 px-10 py-2 rounded-lg font-semibold text-white"
          >
            Calculate
          </button>
        </motion.div>
      </form>
      {isCalculated && (
        <div className="mt-4">
          <PDFDownloadLink
            document={MyDocument}
            fileName="InsuranceCalculation.pdf"
            className="bg-green-500 text-white p-2 rounded"
          >
            {({ loading }) =>
              loading ? "Preparing document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 50,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  data: {
    fontSize: 14,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #eaeaea",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "right",
  },
  label: {
    fontWeight: "bold",
    width: "80%",
  },
  value: {
    width: "60%",
    textAlign: "right",
  },
});

export default InsuranceDemo;
