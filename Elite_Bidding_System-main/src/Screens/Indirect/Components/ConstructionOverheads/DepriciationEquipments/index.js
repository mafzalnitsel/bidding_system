import { useEffect, useState, useRef } from "react";
import "./index.css";
import {
    Loader,
    TableCustomStyle,
    fixedtablediv,
    fixedtableheader,
    fixedtablerow,
} from "../../../../../Utils";
import { Table } from "react-bootstrap";
import LINKS from "../../../../../Utils/Links";
import axios from "axios";
import { useAlert } from "react-alert";
import Select from "react-select";
import MenuList from "../../../../../Utils/MenuList";
import CustomModal from "../../../../Common/Modal";
import initialEquipmentData from "./initialEquipmentData";

function EquipmentManagement({ data }) {
    const alert = useAlert();
    const [selectedItems, setSelectedItems] = useState([{}]);
    const [headerData, setHeaderData] = useState({ code: "", comments: "" });
    const [loading, setLoading] = useState(false);
    const [equipmentList, setEquipmentList] = useState([]);
    const [docTotal, setDocTotal] = useState(0);
    const [searchModal, setSearchModal] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const menuRef = useRef(null);
    const codeRef = useRef();
    // New state for diesel rate
    const [dieselRate, setDieselRate] = useState(248); // Initialize with default value

    const API_TYPES = {
        GET: `${LINKS.api}/GetApi`,
        POST: `${LINKS.api}/POSTApi`,
        PATCH: `${LINKS.api}/PATCHApi`,
    };

    useEffect(() => {
        let cook = localStorage.getItem("cookie");
        if (cook) {
            fetchEquipmentList(cook);
        }

        if (data) {
            setHeaderData(data);
            setSelectedItems(data?.EquipmentCollection || [{}]);
            setDocTotal(calculateTotal(data?.EquipmentCollection || []));
        } else {
            setEquipmentList(
                initialEquipmentData.map((item) => ({
                    value: item.Code,
                    label: `${item.Code} - ${item.Equipment}`,
                    item,
                }))
            );
        }
    }, [data]);

    const fetchEquipmentList = async (cookie) => {
        setLoading(true);
        let SAPApi = `Equipment?$select=Code,Equipment,MonthlyRent,RatePerHr,ConsumptionPerLtrMCHrs`;
        await axios
            .post(API_TYPES.GET, { api: SAPApi, cookie })
            .then((res) => {
                if (res.data.value) {
                    const equipmentData = res.data.value.map((element) => ({
                        value: element.Code,
                        label: `${element.Code} - ${element.Equipment}`,
                        item: element,
                    }));
                    setEquipmentList(equipmentData);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const calculateTotal = (items) => {
        return items
            .reduce((sum, item) => {
                if (item.Code) {
                    return sum + (item.TotalAmount || 0);
                }
                return sum;
            }, 0)
            .toFixed(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHeaderData((prev) => ({ ...prev, [name]: value }));
    };

    // New handler for diesel rate input
    const handleDieselRateChange = (e) => {
        const value = Number(e.target.value) || 0;
        setDieselRate(value);
        // Recalculate totals for all items when diesel rate changes
        const updatedItems = selectedItems.map((item) => {
            if (item.Code && item.TotalMCHrs && item.ConsumptionPerLtrMCHrs) {
                const totalFuel = item.TotalMCHrs * item.ConsumptionPerLtrMCHrs;
                return { ...item, TotalFuelInLtr: totalFuel, TotalAmount: totalFuel * value };
            }
            return item;
        });
        setSelectedItems([...updatedItems, updatedItems.at(-1) ? {} : []]);
        setDocTotal(calculateTotal(updatedItems));
    };

    const handleTableInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = [...selectedItems];
        updatedItems[index] = { ...updatedItems[index], [name]: Number(value) };

        // Recalculate Total Fuel and Total Amount using dynamic diesel rate
        if (name === "TotalMCHrs" || name === "ConsumptionPerLtrMCHrs") {
            updatedItems[index].TotalFuelInLtr =
                updatedItems[index].TotalMCHrs * updatedItems[index].ConsumptionPerLtrMCHrs;
            updatedItems[index].TotalAmount = updatedItems[index].TotalFuelInLtr * dieselRate;
        }

        setSelectedItems([...updatedItems, updatedItems.at(-1) ? {} : []]);
        setDocTotal(calculateTotal(updatedItems));
    };

    const handleEquipmentSelect = (selected, index) => {
        const updatedItems = [...selectedItems];
        updatedItems[index] = {
            ...updatedItems[index],
            Code: selected.value,
            Equipment: selected.item.Equipment,
            MonthlyRent: selected.item.MonthlyRent,
            RatePerHr: selected.item.RatePerHr,
            ConsumptionPerLtrMCHrs: selected.item.ConsumptionPerLtrMCHrs,
            TotalFuelInLtr: updatedItems[index].TotalMCHrs
                ? updatedItems[index].TotalMCHrs * selected.item.ConsumptionPerLtrMCHrs
                : 0,
            TotalAmount: updatedItems[index].TotalMCHrs
                ? updatedItems[index].TotalMCHrs * selected.item.ConsumptionPerLtrMCHrs * dieselRate
                : 0,
        };
        setSelectedItems([...updatedItems, updatedItems.at(-1) ? {} : []]);
        setDocTotal(calculateTotal(updatedItems));
    };

    const submit = async () => {
        setLoading(true);
        const details = selectedItems
            .filter((item) => item.Code)
            .map((item) => ({
                Code: item.Code,
                Equipment: item.Equipment,
                TotalMCHrs: item.TotalMCHrs,
                MonthlyRent: item.MonthlyRent,
                RatePerHr: item.RatePerHr,
                ConsumptionPerLtrMCHrs: item.ConsumptionPerLtrMCHrs,
                TotalFuelInLtr: item.TotalFuelInLtr,
                TotalAmount: item.TotalAmount,
            }));

        const body = {
            U_DocTotal: docTotal,
            Code: headerData.code,
            U_Comments: headerData.comments,
            EquipmentCollection: details,
            // Optionally include diesel rate in the submission if needed
            U_DieselRate: dieselRate,
        };

        let cook = localStorage.getItem("cookie");
        // await axios
        //     .post(API_TYPES.POST, {
        //         body: JSON.stringify(body),
        //         api: `Equipment`,
        //         cookie: cook,
        //     })
        //     .then((res) => {
        //         if (res.data?.Code) {
        //             alert.success("Operation completed successfully");
        //             setSelectedItems([{}]);
        //             setDocTotal(0);
        //             setHeaderData({ code: "", comments: "" });
        //             setDieselRate(248); // Reset diesel rate after submission
        //         } else {
        //             alert.error(JSON.stringify(res.data.error.message));
        //         }
        //     })
        //     .catch((error) => console.error(error))
        //     .finally(() => setLoading(false));
    };

    const handleContextMenu = (event, index, code) => {
        if (!code) return;
        event.preventDefault();
        const menuWidth = 150;
        const menuHeight = 50;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        let x = event.clientX;
        let y = event.clientY;

        if (x + menuWidth > screenWidth) x = screenWidth - menuWidth - 10;
        if (y + menuHeight > screenHeight) y = screenHeight - menuHeight - 10;

        setContextMenu({ x, y, index, code });
    };

    const handleRemoveItem = (index) => {
        setSelectedItems((prev) => prev.filter((_, i) => i !== index));
        setContextMenu(null);
        setDocTotal(calculateTotal(selectedItems.filter((_, i) => i !== index)));
    };

    useEffect(() => {
        if (contextMenu) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [contextMenu]);

    useEffect(() => {
        setSelectedItems(initialEquipmentData);
        setDocTotal(calculateTotal(initialEquipmentData));
        return () => {
            setSelectedItems([]);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setContextMenu(null);
        }
    };

    return (
        <>
            <Loader visible={loading} />

            <CustomModal
                title={"List of Equipment"}
                isOpen={searchModal}
                setIsOpen={() => setSearchModal(false)}
            >
                <Table striped bordered hover className="table">
                    <thead>
                        <tr className="table_header_row">
                            <th>Sr</th>
                            <th>Code</th>
                            <th>Comments</th>
                            <th>Document Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchData?.length ? (
                            searchData.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        setHeaderData(item);
                                        setSelectedItems([...item.EquipmentCollection, {}]);
                                        setDocTotal(item.U_DocTotal);
                                        // Set diesel rate if included in data
                                        setDieselRate(item.U_DieselRate || 248);
                                        setSearchModal(false);
                                    }}
                                    className="table_body_row"
                                >
                                    <td>{index + 1}</td>
                                    <td>{item.Code}</td>
                                    <td>{item.U_Comments}</td>
                                    <td>{item.U_DocTotal}</td>
                                </tr>
                            ))
                        ) : (
                            <div>No Search Data</div>
                        )}
                    </tbody>
                </Table>
            </CustomModal>

            {contextMenu && (
                <div
                    ref={menuRef}
                    className="context-menu"
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                >
                    <p>Are you sure you want to remove this item? [{contextMenu.code}]</p>
                    <button
                        type="button"
                        className="context-menu-button"
                        onClick={() => handleRemoveItem(contextMenu.index)}
                    >
                        Remove Item
                    </button>
                </div>
            )}

            <div>
                <h1
                    style={{
                        textAlign: "center",
                        color: "#c32127",
                        margin: "30px",
                    }}
                >
                    Equipment Management
                </h1>
            </div>

            <div className="main_container">
                <div className="left">
                    <div className="header_items_container">
                        <label>Code</label>
                        <input
                            ref={codeRef}
                            type="text"
                            value={headerData.code}
                            onChange={handleInputChange}
                            className="input code_input"
                            name="code"
                        />
                    </div>
                    <div className="header_items_container">
                        <label>Comments</label>
                        <input
                            type="text"
                            value={headerData.comments}
                            onChange={handleInputChange}
                            className="input"
                            name="comments"
                        />
                    </div>
                    {/* New Diesel Rate Input Field */}
                    <div className="header_items_container">
                        <label>Diesel Rate (per Ltr)</label>
                        <input
                            type="number"
                            value={dieselRate}
                            onChange={handleDieselRateChange}
                            className="input"
                            name="dieselRate"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <div className="right">
                    <div className="header_items_container">
                        <label>Total</label>
                        <input
                            disabled
                            type="text"
                            className="input"
                            value={docTotal}
                        />
                    </div>
                </div>
            </div>

            <div className="table_container" style={fixedtablediv}>
                <Table striped bordered hover>
                    <thead style={fixedtableheader}>
                        <tr style={{ ...fixedtablerow, background: "#0b9fc8" }}>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>#</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Code</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Equipment</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Total MC Hrs</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Monthly Rent</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Rate/Hr</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Consumption (Ltr/MC Hrs)</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Total Fuel (Ltr)</th>
                            <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedItems.map((item, index) => (
                            <tr
                                key={index}
                                onContextMenu={(e) => handleContextMenu(e, index, item.Code)}
                            >
                                <td><div className="inside_td">{index + 1}</div></td>
                                <td>
                                    <div className="inside_td">
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={TableCustomStyle}
                                            onChange={(e) => handleEquipmentSelect(e, index)}
                                            value={equipmentList.filter((list) => list.value === item.Code)}
                                            options={equipmentList}
                                            isSearchable
                                            components={{ MenuList }}
                                        />
                                    </div>
                                </td>
                                <td><div className="inside_td">{item?.Equipment}</div></td>
                                <td>
                                    <div className="inside_td">
                                        <input
                                            type="number"
                                            value={item?.TotalMCHrs || ""}
                                            onChange={(e) => handleTableInputChange(e, index)}
                                            name="TotalMCHrs"
                                            className="form-control"
                                        />
                                    </div>
                                </td>
                                <td><div className="inside_td">{item?.MonthlyRent || "-"}</div></td>
                                <td><div className="inside_td">{item?.RatePerHr || "-"}</div></td>
                                <td><div className="inside_td">{item?.ConsumptionPerLtrMCHrs || "-"}</div></td>
                                <td><div className="inside_td">{item?.TotalFuelInLtr || "-"}</div></td>
                                <td><div className="inside_td">{item?.TotalAmount || "-"}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="button_main_container">
                <button
                    type="button"
                    className="custombutton"
                    disabled={loading}
                    onClick={submit}
                >
                    Add
                </button>
            </div>
        </>
    );
}

export default EquipmentManagement;