import React, { useState } from "react";
import Select from "react-select";
import { CustomSelect } from "../../../../../../Utils";

const toNumber = (val, fallback = 0) => {
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
};

const typeOptions = [
    { value: "Bank", label: "Bank" },
    { value: "Insurance", label: "Insurance" },
];

const rowStyle = { display: "flex", alignItems: "center", gap: "20px", margin: "16px 0" }

const Guarantee = ({ title }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [type, setType] = useState("Bank"); // top-level type selector

    const [rows, setRows] = useState([
        {
            customer: "Riko Dik Project",
            contractValue: 1750000000,
            mobilizationPercent: 25,
            constructionPeriodMonths: 12,
            includeExtraQuarter: true,
            premiumPercentPerQuarter: 0.232,
            kiborPercent: 11,
            bankChargesPercent: 2,
            commissionPercent: 0,
            cashMarginPercent: 10,
        },
    ]);

    // === Calculations ===
    const calcMobilizationAmount = (row) =>
        toNumber(row.contractValue) * (toNumber(row.mobilizationPercent) / 100);

    const calcQuarters = (row) => {
        const base = Math.ceil(toNumber(row.constructionPeriodMonths) / 3);
        return base + (row.includeExtraQuarter ? 1 : 0);
    };

    const calcPremiumAPCAmount = (row) =>
        (calcQuarters(row) *
            toNumber(row.premiumPercentPerQuarter) *
            calcMobilizationAmount(row)) / 100;

    const calcCombinedFinanceRatePercent = (row) =>
        toNumber(row.kiborPercent) +
        toNumber(row.bankChargesPercent) +
        (type !== "Bank" ? toNumber(row.commissionPercent) : 0);

    const calcCashMarginAmount = (row) =>
        calcMobilizationAmount(row) *
        (toNumber(row.cashMarginPercent) / 100) *
        (calcCombinedFinanceRatePercent(row) / 100);

    // === Handlers ===
    const handleChange = (e, index, field, isCheckbox = false) => {
        const value = isCheckbox
            ? e.target.checked
            : e.target.type === "number"
                ? e.target.value === ""
                    ? ""
                    : toNumber(e.target.value)
                : e.target.value;

        setRows((prev) => {
            const next = [...prev];
            next[index][field] = value;
            return next;
        });
    };

    const handleAddRow = (e) => {
        if (e.key === "Enter") {
            setRows((prev) => [
                ...prev,
                {
                    customer: "",
                    contractValue: 0,
                    mobilizationPercent: 0,
                    constructionPeriodMonths: 0,
                    includeExtraQuarter: true,
                    premiumPercentPerQuarter: 0,
                    kiborPercent: 0,
                    bankChargesPercent: 0,
                    commissionPercent: 0,
                    cashMarginPercent: 10,
                },
            ]);
        }
    };

    return (
        <div className="main-container">
            <h2 className="main-heading">{title}</h2>
            {/* Top row with dropdown and checkbox */}
            <div style={{ ...rowStyle, justifyContent: "space-between" }}>
                <div style={rowStyle}>
                    <label style={{ marginRight: "10px", marginBottom: "10px" }}>Select Type:</label>
                    <Select
                        value={typeOptions.find((opt) => opt.value === type)}
                        onChange={(opt) => setType(opt.value)}
                        options={typeOptions}
                        menuPlacement="auto"
                        styles={CustomSelect}
                    />
                </div>

                <div>
                    <label style={rowStyle}>
                        <input
                            type="checkbox"
                            checked={showAdvanced}
                            onChange={(e) => setShowAdvanced(e.target.checked)}
                        />
                        <span style={{ textWrap: "nowrap" }}>
                            Show Finance Columns
                        </span>
                    </label>
                </div>
            </div>


            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contract Value</th>
                            <th>Mobilization %</th>
                            <th>Mobilization Amount</th>
                            <th>Construction Period (Months)</th>
                            <th>+1 Qtr (Helper)</th>
                            <th>Quarters (⌈Months ÷ 3⌉ + 1)</th>
                            <th>Premium % / Quarter</th>
                            <th>Premium APC Amount</th>

                            {showAdvanced && (
                                <>
                                    <th>KIBOR %</th>
                                    <th>Bank Charges %</th>
                                    {type !== "Bank" && <th>Commission %</th>}
                                    <th>Cash Margin %</th>
                                    <th>Cash Margin Amount</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} onKeyDown={handleAddRow}>
                                <td>
                                    <input
                                        type="text"
                                        value={row.customer}
                                        onChange={(e) => handleChange(e, i, "customer")}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.contractValue}
                                        onChange={(e) => handleChange(e, i, "contractValue")}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.mobilizationPercent}
                                        onChange={(e) => handleChange(e, i, "mobilizationPercent")}
                                    />
                                </td>
                                <td>{calcMobilizationAmount(row).toLocaleString()}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.constructionPeriodMonths}
                                        onChange={(e) =>
                                            handleChange(e, i, "constructionPeriodMonths")
                                        }
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={row.includeExtraQuarter}
                                        onChange={(e) =>
                                            handleChange(e, i, "includeExtraQuarter", true)
                                        }
                                    />
                                </td>
                                <td>{calcQuarters(row)}</td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={row.premiumPercentPerQuarter}
                                        onChange={(e) =>
                                            handleChange(e, i, "premiumPercentPerQuarter")
                                        }
                                    />
                                </td>
                                <td>{calcPremiumAPCAmount(row).toLocaleString()}</td>

                                {showAdvanced && (
                                    <>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.kiborPercent}
                                                onChange={(e) => handleChange(e, i, "kiborPercent")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.bankChargesPercent}
                                                onChange={(e) =>
                                                    handleChange(e, i, "bankChargesPercent")
                                                }
                                            />
                                        </td>
                                        {type !== "Bank" && (
                                            <td>
                                                <input
                                                    type="number"
                                                    step={0.01}
                                                    value={row.commissionPercent}
                                                    onChange={(e) =>
                                                        handleChange(e, i, "commissionPercent")
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td>
                                            <input
                                                type="number"
                                                value={row.cashMarginPercent}
                                                onChange={(e) =>
                                                    handleChange(e, i, "cashMarginPercent")
                                                }
                                            />
                                        </td>
                                        <td>{calcCashMarginAmount(row).toLocaleString()}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Guarantee;
