import React, { useState } from "react";
import { Table } from "react-bootstrap";

// Initial data for the table
const initialInsuranceData = [
    {
        qtrNo: 1,
        particulars: "Contractor's All Risks",
        mobAdv: "500,000,000",
        minRate: "0.180%",
        minAmount: "900,000",
        highRate: "0.240%",
        highAmount: "1,200,000",
    },
];

const initialTotal = {
    minAmount: "900,000",
    highAmount: "1,200,000",
};

function ContractorAllRiskGuarantee() {
    const [insuranceData, setInsuranceData] = useState(initialInsuranceData);
    const [total, setTotal] = useState(initialTotal);
    const [approxCost, setApproxCost] = useState("500,000,000");
    const [contractPeriod, setContractPeriod] = useState("18 Months");

    // Handle input changes for table data
    const handleInputChange = (index, field, value) => {
        const updatedData = [...insuranceData];
        updatedData[index][field] = value;
        setInsuranceData(updatedData);

        // Recalculate totals
        const newMinAmount = updatedData.reduce((sum, item) => sum + parseFloat(item.minAmount.replace(/,/g, '') || 0), 0);
        const newHighAmount = updatedData.reduce((sum, item) => sum + parseFloat(item.highAmount.replace(/,/g, '') || 0), 0);
        setTotal({
            minAmount: newMinAmount.toLocaleString(),
            highAmount: newHighAmount.toLocaleString(),
        });
    };

    // Handle header input changes
    const handleHeaderChange = (field, value) => {
        if (field === "approxCost") setApproxCost(value);
        if (field === "contractPeriod") setContractPeriod(value);
    };

    return (
        <>
            <div>
                <h1
                    style={{
                        textAlign: "center",
                        color: "#c32127",
                        margin: "30px",
                    }}
                >
                    PN Farm Sector D - Insurance Cost
                </h1>
            </div>

            <div className="main_container" style={{ padding: "20px" }}>
                <div className="header_items_container">
                    <label>
                        <strong>Approximate Cost:</strong>{" "}
                        <input
                            type="text"
                            value={approxCost}
                            onChange={(e) => handleHeaderChange("approxCost", e.target.value)}
                            style={{ border: "1px solid #ccc", padding: "5px" }}
                        />
                    </label>
                </div>
                <div className="header_items_container">
                    <label>
                        <strong>Contract Period:</strong>{" "}
                        <input
                            type="text"
                            value={contractPeriod}
                            onChange={(e) => handleHeaderChange("contractPeriod", e.target.value)}
                            style={{ border: "1px solid #ccc", padding: "5px" }}
                        />
                    </label>
                </div>
                <div className="header_items_container">
                    <label><strong>Insurance Type:</strong> Contractor's All Risk Insurance @ Contract Value</label>
                </div>
            </div>

            <div className="table_container" style={{ margin: "20px", overflowX: "auto" }}>
                <Table striped bordered hover className="table">
                    <thead style={{ position: "sticky", top: 0 }}>
                        <tr style={{ background: "#0b9fc8" }}>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Qtr. Nos.</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>PARTICULARS</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Value of Mob. Adv.</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Minimum Rate</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Minimum Amount</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Higher Side Rate</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Higher Side Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insuranceData.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={item.qtrNo}
                                        onChange={(e) => handleInputChange(index, "qtrNo", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.particulars}
                                        onChange={(e) => handleInputChange(index, "particulars", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.mobAdv}
                                        onChange={(e) => handleInputChange(index, "mobAdv", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.minRate}
                                        onChange={(e) => handleInputChange(index, "minRate", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.minAmount}
                                        onChange={(e) => handleInputChange(index, "minAmount", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.highRate}
                                        onChange={(e) => handleInputChange(index, "highRate", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.highAmount}
                                        onChange={(e) => handleInputChange(index, "highAmount", e.target.value)}
                                        style={{ width: "100%", border: "none", background: "transparent" }}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr style={{ fontWeight: "bold" }}>
                            <td colSpan={4}><div className="inside_td">Total</div></td>
                            <td><div className="inside_td">{total.minAmount}</div></td>
                            <td><div className="inside_td"></div></td>
                            <td><div className="inside_td">{total.highAmount}</div></td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div className="notes_container" style={{ margin: "20px" }}>
                <p><strong>Notes:</strong></p>
                <ol>
                    <li>Above Amounts are calculated in case of project completion according to planned period of 18 Months.</li>
                    <li>Above Amounts are calculated in case of requirement of Insurance according to Contract Value.</li>
                </ol>
            </div>
        </>
    );
}

export default ContractorAllRiskGuarantee;