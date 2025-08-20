import { useEffect, useState, useRef } from "react";
import "./index.css";
import {
    Loader,
    Header,
} from "../../Utils";
import { Table } from "react-bootstrap";
import LINKS from "../../Utils/Links";
import axios from "axios";
import CustomModal from "../Common/Modal";
import { useAlert } from "react-alert";
import IndirectCostStructure from "./Components/Common/IndirectCostStructure";

function Indirect({ data }) {
    const alert = useAlert();
    const fileInputRef = useRef(null);
    const [SelectedItems, setSelectedItems] = useState([{ abc: "abc" }]);
    const [headerdata, setheaderdata] = useState({ incomtax: "" });
    const [loading, setLoading] = useState(false);
    const [TaxCodelist, setTaxCodelist] = useState();
    const [doctotal, setdoctotal] = useState();
    const [gettotalfreight, setgettotalfreight] = useState();
    const [type, settype] = useState();
    const [uomlist, setuomlist] = useState();
    const [packagesList, setPackagesList] = useState([]);
    const [searchModal, setSearchModal] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [isMain, setIsMain] = useState(true);
    const [isUpdating, setIsUpdating] = useState();
    const codeRef = useRef();

    const [contextMenu, setContextMenu] = useState(null);
    const menuRef = useRef(null);

    const API_TYPES = {
        GET: `${LINKS.api}/GetApi`,
        POST: `${LINKS.api}/POSTApi`,
        PATCH: `${LINKS.api}/PATCHApi`,
        SECONDPOST: `${LINKS.api}/SecondDBPOSTApi`,
    };

    const otherItems = ["L", "FW", "LT", "E"]

    useEffect(() => {
        let cook = localStorage.getItem("cookie");
        if (cook) {
            TableTaxCode(cook);
            getunitofmeasure(cook);
            getfreightdata(cook);
            freightdata(cook);
            if (packagesList.length === 0 && !data) {
                mainPackages(cook);
            }
        }

        if (data) {
            setheaderdata(data);
            setSelectedItems(data?.MMP1Collection);
            setdoctotal(data?.U_DocTotal);
            settype(data?.U_Type);
            if (otherItems.includes(data?.U_Type)) {
                setIsMain(false);
                otherPackages();
            } else {
                setIsMain(true);
                mainPackages();
            }
        }
    }, []);

    function getDocTotal(array) {
        if (array?.length === 0) return 0;
        const stringArr = array.map((item) => {
            return otherItems.includes(headerdata?.U_Type)
                ? item?.U_Amount
                : Number(item.U_Rate ? item.U_Rate : 0) *
                Number(item.U_Quantity ? item.U_Quantity : 1);
        });

        const sum = stringArr.reduce((prev, next) => {
            const num = parseFloat(next);
            return !isNaN(num) ? prev + num : prev;
        }, 0);

        return sum ? sum.toFixed(2) : 0;
    }

    useEffect(() => {
        const types = otherItems;
        if (types.includes(type)) {
            setIsMain(false);
        } else {
            setIsMain(true);
        }
    }, [type]);

    const ItemsDropDownfunc = async (selectedList, index, name) => {

        let doclines = SelectedItems;
        doclines[index][name] = selectedList.value;

        if (name !== "U_Unit") {
            doclines[index].ItemCode = selectedList?.label?.split(" - ")[0]?.trim();
            doclines[index].U_MTCode = selectedList?.label?.split(" - ")[0]?.trim();
            doclines[index].ItemName = selectedList?.label?.split(" - ")[1]?.trim();
            doclines[index].U_MTName = selectedList?.label?.split(" - ")[1]?.trim();
            const unit =
                selectedList.item?.PurchaseUnit || selectedList.item?.SaleUnit;
            const units = uomlist.find((element) => element.label === unit);
            // 26 means Hour unit's value
            doclines[index]["U_Unit"] = isMain ? units?.value : 26;
        }


        // doclines[index]["U_Wastage"] = selectedList?.item?.U_Wastage || 5;
        doclines[index]["LineNum"] = index;

        setSelectedItems(
            Object.keys(doclines?.at(-1)).length === 0
                ? [...doclines]
                : [...doclines, {}]
        );
    };

    const mainPackages = async (cook) => {
        setLoading(true);

        let cookie = cook || localStorage.getItem("cookie");

        // let SAPApi = `Items?$select=ItemCode,ItemName,PurchaseUnit &$filter=PurchaseItem eq 'tYES' and startswith(ItemCode, 'RM')`;
        let SAPApi = `Items?$select=ItemCode,ItemName,PurchaseUnit &$filter=Valid eq 'tYES' and ItemType ne 'itFixedAssets' or startswith(ItemCode, 'RM') or startswith(ItemCode, 'FG') or startswith(ItemCode, 'SV') or startswith(ItemCode, 'SP')`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie,
            })
            .then(function (res) {
                console.log("res.data.value", res);
                if (res.data.value) {
                    let ItemsDropDown = [];
                    res.data.value.forEach((element) => {
                        ItemsDropDown.push({
                            value: element.ItemCode,
                            label: element.ItemCode + " - " + element?.ItemName,
                            item: { PurchaseUnit: element.PurchaseUnit },
                        });
                    });
                    console.log(ItemsDropDown);
                    setPackagesList(ItemsDropDown);
                    setLoading(false);
                }
            })
            .catch(function (error) { })
            .finally(() => {
                setLoading(false);
            });
    };

    const otherPackages = async () => {
        setLoading(true);
        let cook = localStorage.getItem("cookie");

        let SAPApi = `OMMT`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                console.log("Other Packages", res);

                if (res.data.value) {
                    let ItemsDropDown = [];
                    res.data.value.forEach((element) => {
                        ItemsDropDown.push({
                            value: element.Code,
                            label: element.Code + " - " + element?.Name,
                            item: element,
                        });
                    });
                    setPackagesList(ItemsDropDown);
                    setLoading(false);
                }
            })
            .catch(function (error) { })
            .finally(() => {
                setLoading(false);
            });
    };

    const getunitofmeasure = async (cook) => {
        setLoading(true);
        let SAPApi = `UnitOfMeasurements?$select=Code,Name,AbsEntry`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                console.log("uom", res.data);
                if (res.data.value) {
                    let ItemsDropDown = [];
                    res.data.value.forEach((element) => {
                        ItemsDropDown.push({
                            value: element.AbsEntry,
                            label: element.Name,
                        });
                    });
                    setuomlist(ItemsDropDown);
                    setLoading(false);
                }
            })
            .catch(function (error) { })
            .finally(() => {
                setLoading(false);
            });
    };

    const TableTaxCode = async (cook) => {
        let SAPApi = `VatGroups?$select=Code,Name,VatGroups_Lines&$filter=Inactive eq 'tNO'`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                if (res.data.value) {
                    let ItemsDropDown = [];
                    res.data.value.forEach((element) => {
                        ItemsDropDown.push({
                            value: element?.Code,
                            label: element.Name + " - " + element?.Code,
                            item: element,
                        });
                    });
                    setTaxCodelist(ItemsDropDown);
                }
            })
            .catch(function (error) { });
    };

    const getvaluefrominput = (e) => {
        const { name, value } = e.target;
        setheaderdata((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const getvaluefromselect = (e, name) => {
        let data = headerdata;
        data[name] = e.value;
        setheaderdata(data);
    };

    const tablegetvaluefrominput = (e, index) => {
        let updatedDetails = [...SelectedItems];
        updatedDetails[index] = {
            ...updatedDetails[index],
            [e.target.name]: Number(e.target.value),
        };

        /* 
        if (e.target.name === "U_UnitFactor" && isMain) {
          updatedDetails[index]["U_Quantity"] =
            (updatedDetails[index]["U_UnitFactor"] +
              updatedDetails[index]["U_UnitFactor"] *
                (updatedDetails[index]["U_Wastage"] / 100)) *
            1;
        }
        */

        if (!isMain) {
            updatedDetails[index].U_Amount =
                (isNaN(parseFloat(updatedDetails[index]?.U_Quantity))
                    ? 1
                    : updatedDetails[index]?.U_Quantity) *
                (isNaN(parseFloat(updatedDetails[index]?.U_Rate))
                    ? 0
                    : updatedDetails[index]?.U_Rate);
            updatedDetails[index].U_Amount =
                updatedDetails[index].U_Amount?.toFixed(2);
        }

        let sum = 0;
        if (isMain) {
            updatedDetails.forEach((element) => {
                if (element.ItemCode || element.Code) {
                    sum =
                        sum +
                        Number([element.U_Rate]) *
                        Number(element.U_Quantity ? element.U_Quantity : 1);
                }
            });
        } else {
            updatedDetails.forEach((element) => {
                if (element.ItemCode || element.Code) {
                    sum = sum + Number([element.U_Amount]);
                }
            });
        }

        sum = sum?.toFixed(2);
        setdoctotal(sum);
        setSelectedItems([...updatedDetails]);
    };

    const submit = async () => {
        setLoading(true);
        console.log("tabledetails", SelectedItems);
        console.log("headerdata", headerdata);

        let details = [];
        SelectedItems?.forEach((item) => {
            if (!item.ItemCode) {
                return;
            }

            if (isMain) {
                details.push({
                    U_MTCode: item.ItemCode,
                    U_MTName: item?.ItemName,
                    U_Unit: item.U_Unit,
                    /* U_UnitFactor: item.U_UnitFactor, */
                    /* U_Wastage: item.U_Wastage, */
                    U_Quantity: item.U_Quantity,
                    U_Rate: item.U_Rate,
                });
            } else {
                details.push({
                    U_MTCode: item.ItemCode,
                    U_MTName: item?.ItemName,
                    U_Quantity: item.U_Quantity,
                    U_Unit: item.U_Unit,
                    U_Rate: item.U_Rate,
                    U_Amount: item.U_Amount,
                });
            }
        });
        let body = {
            U_DocTotal: doctotal,
            Code: headerdata?.Code,
            U_Comments: headerdata?.U_Comments,
            U_Type: type,
            MMP1Collection: details,
        };
        console.log("body", body);
        PostInFirstDB(body);
    };

    const PostInFirstDB = async (body) => {
        let cook = await localStorage.getItem("cookie");
        if (cook) {
            await axios
                .post(API_TYPES.POST, {
                    body: JSON.stringify(body),
                    api: `OMMP`,
                    cookie: cook,
                })
                .then(function (res) {
                    console.log(res);
                    if (res.data?.Code) {
                        alert.success("Operation completed successfully");
                        setTimeout(() => {
                            // window.location.reload();
                            setSelectedItems([{}]);
                            setdoctotal("");
                            setheaderdata({
                                Code: "",
                                U_Comments: "",
                                U_Type: "",
                                U_DocTotal: "",
                            });
                        }, 1000);
                    } else {
                        alert.error(JSON.stringify(res.data.error.message));
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const submitPatch = async (RowCode, callback) => {
        setLoading(true);
        console.log("tabledetails", SelectedItems);
        console.log("headerdata", headerdata);

        let details = [];
        SelectedItems?.forEach((item) => {
            if (RowCode)
                if ((item.ItemCode || item.U_MTCode) === RowCode) {
                    return;
                }

            if (!item.Code && !item.ItemCode && !item.U_MTCode) {
                return;
            }

            if (isMain) {
                details.push({
                    U_MTCode: item.ItemCode || item.U_MTCode,
                    U_MTName: item?.ItemName || item.U_MTName,
                    U_Unit: item.U_Unit,
                    /* U_UnitFactor: item.U_UnitFactor, */
                    /* U_Wastage: item.U_Wastage, */
                    U_Quantity: item.U_Quantity,
                    U_Rate: item.U_Rate,
                });
            } else {
                details.push({
                    U_MTCode: item.ItemCode || item.U_MTCode,
                    U_MTName: item?.ItemName || item.U_MTName,
                    U_Quantity: item.U_Quantity,
                    U_Unit: item.U_Unit,
                    U_Rate: item.U_Rate,
                    U_Amount: item.U_Amount,
                });
            }
        });

        console.log("details", details);

        const sum = getDocTotal(details);

        let body = {
            U_DocTotal: sum,
            Code: headerdata?.Code,
            U_Comments: headerdata?.U_Comments,
            U_Type: type,
            MMP1Collection: details,
        };

        setdoctotal(sum || "0.00");

        console.log("patch body", body);

        patch(headerdata.Code, body, callback);
    };

    const patch = async (id, body, callback) => {
        let cook = await localStorage.getItem("cookie");
        if (cook) {
            await axios
                .post(API_TYPES.PATCH, {
                    body: JSON.stringify(body),
                    api: `OMMP('${id}')`,
                    cookie: cook,
                })
                .then(function (res) {
                    if (
                        res.data === "update" ||
                        (res.data === "You Are Not Permited To Perform This Action" &&
                            !isUpdating)
                    ) {
                        if (callback) callback();
                        if (res.data === "update")
                            alert.success("Operation completed successfully");
                    } else {
                        alert.error(JSON.stringify(res.data.error.message));
                    }
                })
                .catch(function (error) { })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const freightdata = async (cook) => {
        let body = {
            SqlCode: "freightvalues",
            SqlName: "freightvalues",
            SqlText: "Select DocEntry,LineNum,ItemCode,StckDstSum from POR1",
        };
        let api = `SQLQueries`;
        if (cook) {
            await axios
                .post(API_TYPES.POST, {
                    body: JSON.stringify(body),
                    api: api,
                    cookie: cook,
                })
                .then(async function (res) {
                    console.log("res", res);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const getfreightdata = async (cook) => {
        let sapAPi = `SQLQueries('freightvalues')/List`;
        let array = [];
        await axios
            .post(API_TYPES.GET, { api: sapAPi, cookie: sapAPi })
            .then(async function (res) {
                if (res.data.value) {
                    console.log("res", res);
                    res.data.value.forEach((element) => {
                        array[element.DocEntry + element.ItemCode + element.LineNum] = {
                            StckDstSum: element.StckDstSum,
                        };
                    });
                    setgettotalfreight(array);
                }
            })
            .catch({});
    };

    const lastpurchseprice = async (item, index) => {
        let cook = await localStorage.getItem("cookie");
        let doclines = "PurchaseOrders/DocumentLines";
        let prData = SelectedItems;
        let SAPapi = `$crossjoin(PurchaseOrders,${doclines})?$expand=PurchaseOrders($select=DocNum,DiscountPercent,DocEntry,DocDate,CardName),
        ${doclines}($select=Quantity,ItemCode,ItemDescription,MeasureUnit,ProjectCode,DocEntry,BaseEntry,LineTotal,DiscountPercent,LineNum)
        &$filter=PurchaseOrders/DocEntry eq ${doclines}/DocEntry and ${doclines}/ItemCode eq '${item}' 
        &$orderby=PurchaseOrders/DocDate desc &$top=1`;
        console.log(SAPapi);
        await axios
            .post(API_TYPES.GET, {
                api: SAPapi,
                cookie: cook,
            })
            .then(function (res) {
                console.log(res);
                if (res.data.value.length > 0) {
                    if (res.data.value[0]["PurchaseOrders/DocumentLines"]) {
                        let element2 = res.data.value[0]["PurchaseOrders/DocumentLines"];
                        let freighttotal = gettotalfreight
                            ? gettotalfreight[
                                element2.DocEntry + element2.ItemCode + element2.LineTotal
                            ].StckDstSum
                            : 0;
                        let discount = res.data.value[0]["PurchaseOrders"].DiscountPercent;
                        prData[index]["U_Rate"] =
                            (element2.LineTotal -
                                (element2.LineTotal / 100) * discount +
                                freighttotal) /
                            element2.Quantity;
                        setSelectedItems([...prData, []]);
                    } else {
                        let prData = SelectedItems;
                        prData[index]["U_Rate"] = 0;
                        setSelectedItems([...prData, []]);
                    }
                    let sum = 0;
                    prData.forEach((element) => {
                        sum =
                            sum +
                            Number(element.U_Rate ? element.U_Rate : 0) *
                            Number(element.U_Quantity ? element.U_Quantity : 1);
                    });

                    setdoctotal(sum ? sum.toFixed(2) : 0);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const fetchAllData = async (cook) => {
        setLoading(true);
        console.log("fetching all data...");
        let SAPApi =
            type && type !== "-"
                ? `OMMP?$select=Code,U_Comments,U_DocTotal,U_Type,MMP1Collection&$filter=U_Type eq '${type}'`
                : `OMMP?$select=Code,U_Comments,U_DocTotal,U_Type,MMP1Collection`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                if (res.data.value) {
                    console.log("res for search ", res.data.value);
                    setSelectedItems([{}]);
                    setSearchData(res.data.value);
                    setSearchModal(true);
                    setLoading(false);
                } else {
                    console.log(res.data);
                }
            })
            .catch(function (error) { })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchFilteredData = async (value, cook) => {
        setLoading(true);
        console.log("fetching filtered data...");
        setSearchData([]);
        let SAPApi = `OMMP?$filter=Code eq '${encodeURIComponent(value)}'`;
        await axios
            .post(API_TYPES.GET, {
                api: SAPApi,
                cookie: cook,
            })
            .then(function (res) {
                console.log("res for search", res.data);
                if (res.data.value) {
                    const data = res.data.value[0];

                    if (otherItems.includes(data?.U_Type)) {
                        setIsMain(false);
                        otherPackages();
                    }

                    setdoctotal(data?.U_DocTotal);
                    settype(data?.U_Type);

                    if (!data) {
                        setheaderdata((prev) => ({
                            ...prev,
                            U_Comments: "",
                            U_DocTotal: "",
                            U_Type: "",
                            Code: prev.Code,
                        }));
                        setSelectedItems([{ abc: "abc" }]);
                        setIsUpdating(false);
                        alert.error(`Nothing Found For, With ${value} Code!!!`);
                        return;
                    }

                    setheaderdata(data);
                    setSelectedItems([...data?.MMP1Collection, {}]);
                    setIsUpdating(true);
                }
            })
            .catch(function (error) { })
            .finally(() => {
                setLoading(false);
            });
    };

    console.log(headerdata, "headerdata");

    const handleSearchKeyDown = async (e) => {
        let cook = await localStorage.getItem("cookie");
        if (e.key === "Enter") {
            if (e.target.value === "*") {
                fetchAllData(cook);
            } else {
                fetchFilteredData(e.target.value, cook);
            }
        }
    };

    const handlePopulatePackageDataFromSearch = (itemData) => {
        setheaderdata(itemData);
        settype(itemData?.U_Type);
        if (otherItems.includes(itemData?.U_Type)) {
            setIsMain(false);
            otherPackages();
        }
        setdoctotal(data?.U_DocTotal);
        setSelectedItems([...itemData.MMP1Collection, {}]);
        console.log({ itemData });
        setSearchModal(false);
        setIsUpdating(true);
    };

    const typesoptions = [
        { label: "Select Type", value: "-" },
        { label: "Material Package", value: "M" },
        { label: "Consumable Package", value: "C" },
        { label: "Equipment Package", value: "E" },
        // { label: "Specialized Package", value: "S" },
        { label: "Labour Package", value: "L" },
        { label: "Formwork Package", value: "FW" },
        { label: "Lab Test Package", value: "LT" },
    ];

    useEffect(() => {
        window.addEventListener("keydown", function (e) {
            if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
                e.preventDefault();
                if (codeRef && codeRef?.current) {
                    codeRef.current.focus();
                    codeRef.current.classList.add("active");
                }
            } else {
                if (codeRef && codeRef?.current) {
                    codeRef.current.classList.remove("active");
                }
            }
        });
    }, []);

    const handleContextMenu = (event, index, Code) => {
        if (!Code && !headerdata?.Code) return;

        event.preventDefault();

        const menuWidth = 150;
        const menuHeight = 50;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let x = event.clientX;
        let y = event.clientY;

        if (x + menuWidth > screenWidth) {
            x = screenWidth - menuWidth - 10;
        }

        if (y + menuHeight > screenHeight) {
            y = screenHeight - menuHeight - 10;
        }

        setContextMenu({
            x,
            y,
            index,
            Code,
        });
    };

    const handleRemoveItem = async (Code, index) => {
        if (!isUpdating) {
            setSelectedItems((prevItems) => {
                return prevItems.filter((_, i) => i !== index);
            });
            setContextMenu(null);
            return;
        }

        submitPatch(Code, () => {
            setSelectedItems((prevItems) => {
                return prevItems.filter((_, i) => i !== index);
            });
            setContextMenu(null);
        });
    };

    useEffect(() => {
        if (contextMenu) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenu]);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setContextMenu(null);
        }
    };

    return (
        <>
            <Loader visible={loading} />

            {!data && <Header />}
            {data && (
                <div className="hero-logo">
                    <img
                        alt="Logo"
                        src="/Images/nitsel.png"
                        width="200px"
                        height="70px"
                        className="d-inline-block align-top"
                    />
                </div>
            )}

            <CustomModal
                title={"List of Packages"}
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
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!!searchData?.length !== 0 ? (
                            searchData?.map((item, index) => (
                                <tr
                                    tabIndex={0}
                                    key={index}
                                    onClick={() => handlePopulatePackageDataFromSearch(item)}
                                    onKeyDown={() => handlePopulatePackageDataFromSearch(item)}
                                    // onKeyDown={(e) => {
                                    //   handlePopulatePackageDataFromSearch(item);
                                    // }}
                                    className="table_body_row"
                                >
                                    <td>{index + 1}</td>
                                    <td>{item?.Code}</td>
                                    <td>{item?.U_Comments}</td>
                                    <td>{item.U_DocTotal}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        {typesoptions.find((option) => option.value == item.U_Type)
                                            ?.label || item.U_Type}
                                    </td>
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
                    style={{
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                    }}
                >
                    <p>Are you sure you want to remove this item? [{contextMenu.Code}]</p>
                    <button
                        type="button"
                        className="context-menu-button"
                        onClick={() =>
                            handleRemoveItem(contextMenu.Code, contextMenu.index)
                        }
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
                    Indirect Cost
                </h1>
            </div>

            <div className="main_container">
                <div className="left">
                    <div className="header_items_container">
                        <label>Code</label>
                        <input
                            ref={codeRef}
                            type="email"
                            value={headerdata?.Code}
                            onChange={(e) => getvaluefrominput(e)}
                            onKeyDown={handleSearchKeyDown}
                            className="input code_input"
                            name="Code"
                        />
                    </div>
                </div>
                <div className="right">
                    <div className="header_items_container">
                        <label>Name</label>
                        <input
                            onChange={(e) => getvaluefrominput(e)}
                            value={headerdata?.U_Comments}
                            name="U_Comments"
                            type="text"
                            className="input"
                        />
                    </div>
                </div>
            </div>

            <IndirectCostStructure />

            {!data && (
                <div className="button_main_container">
                    <button
                        type="button"
                        className="custombutton"
                        tabIndex="0"
                        disabled={loading}
                        onClick={() => {
                            if (type === "-" || !type) {
                                console.log("Please select type");

                                alert.error("Please select type");
                                return;
                            }
                            if (isUpdating) {
                                submitPatch();
                            } else {
                                submit();
                            }
                        }}
                    >
                        {isUpdating ? "Update" : "Add"}
                    </button>
                    {/* <button type="button" className="custombutton">
            Cancel
          </button> */}
                </div>
            )}
        </>
    );
}

export default Indirect;
