import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "./index.css";
import { ImArrowRight } from "react-icons/im";
import {
  Loader,
  CustomSelect,
  Header,
  fixedtablediv,
  fixedtableheader,
  fixedtablerow,
} from "../../Utils";
import { Table, Modal } from "react-bootstrap";
import LINKS from "../../Utils/Links";
import * as XLSX from "xlsx";
import axios from "axios";
import { useAlert } from "react-alert";
import ModalForBidElement from "../Common/ModalForBidElement";
import ModalForMaterials from "../Common/ModalForMaterials";
import exportTableToXLSX from "../../Utils/exportTableToXLSX";

function Bidding() {
  const alert = useAlert();
  const fileInputRef = useRef(null);
  const [headerdata, setheaderdata] = useState({ incomtax: 7.5, federal: 18 });
  const [loading, setLoading] = useState(false);
  const [selectedMP, setselectedMP] = useState();
  const [doctotal, setdoctotal] = useState();
  const [tabledetails, settabledetails] = useState();
  const [update, setUpdate] = useState(1);
  const [show3, setShow3] = useState(false);
  const [uomlist, setuomlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [modalType, setModalType] = useState("Package");
  const [subContractMode, setSubContractMode] = useState(false);

  const API_TYPES = {
    GET: `${LINKS.api}/GetApi`,
    POST: `${LINKS.api}/POSTApi`,
    PATCH: `${LINKS.api}/PATCHApi`,
    SECONDPOST: `${LINKS.api}/SecondDBPOSTApi`,
  };

  const tableHeaders = [
    "Serial No.",
    "BOQ Client Number",
    "Group",
    "BOQ Description",
    "Unit Client",
    "Quantity Client",
    "Conversion",
    "Unit System",
    "Quantity System",
    "Standard ManHours",
    "Total ManHours",
    "Rate ManHours",
    // "SubContractor Labour",
    "Material Package",
    "Consumable Package",
    "Equipment Package",
    "Specialized/ Sub-Contract",
    "Labour Package",
    "Formwork Package",
    "Lab Test Package",
    "Material Unit Rate",
    "Material Cost",
    "Consumable Unit Rate",
    "Consumable Cost",
    "Equipment Unit Rate",
    "Equipment Cost",
    "Specialized/ Sub-Contract Unit Rate",
    "Specialized/ Sub-Contract Cost",
    "Labour Unit Rate",
    "Labour Cost",
    "Formwork Unit Rate",
    "Formwork Cost",
    "Lab Test Unit Rate",
    "Lab Test Cost",
    "Unit Rate",
    "Direct Cost",
    "Unit In-Direct",
    "In-Direct Cost",
    "Unit Selling",
    "Selling Price",
    "Unit BOQ Client",
    "Total Amount Client",
    // "Amount",
  ];

  useEffect(() => {
    console.clear();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 4000);
    let cook = localStorage.getItem("cookie");
    if (cook) {
      // TableTaxCode(cook);
      // materialpackage(cook);
      // consumablepackage(cook);
      // equipmentpackage(cook);
      // specializedpackage(cook);
      getunitofmeasure(cook);
      if (uomlist && uomlist?.length > 0) {
        getAllOBEDItems(cook);
      }
    }
    // eslint-disable-next-line
  }, []);

  // Check index of field in tableHeaders
  const checkIndex = (item) => {
    return tableHeaders.findIndex((header) => header === item);
  };

  function convertToNumber(str) {
    if (typeof str !== "string") return NaN;
    const cleanedStr = str.replace(/,/g, "");
    return parseFloat(cleanedStr);
  }

  function parseNumber(str) {
    return typeof str === "string" ? (str.includes("Per") ? parseInt(str.split("Per")[1]) : 1) : null
  }

  const getAllOBEDItems = async (cook) => {
    setLoading(true);
    const packageInfo = [
      { M: checkIndex("Material Package") },
      { C: checkIndex("Consumable Package") },
      { E: checkIndex("Equipment Package") },
      { S: checkIndex("Specialized/ Sub-Contract") },
      { L: checkIndex("Labour Package") },
      { FW: checkIndex("Formwork Package") },
      { LT: checkIndex("Lab Test Package") },
    ];

    const packageCostInfo = [
      { M: checkIndex("Material Unit Rate") },
      { C: checkIndex("Consumable Unit Rate") },
      { E: checkIndex("Equipment Unit Rate") },
      { S: checkIndex("Specialized/ Sub-Contract Unit Rate") },
      { L: checkIndex("Labour Unit Rate") },
      { FW: checkIndex("Formwork Unit Rate") },
      { LT: checkIndex("Lab Test Unit Rate") },
    ];

    let SAPApi = `OBED`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        console.log("getAllOBEDItems", res.data);
        if (res.data.value) {
          res.data.value?.forEach((item) => {
            const tableData = item.BED1Collection;
            tableData.forEach((table_item) => {
              if (table_item.U_Type) {
                settabledetails((prevDetails) => {
                  if (prevDetails) {
                    prevDetails.forEach((details, index) => {
                      if (details) {
                        if (
                          // eslint-disable-next-line
                          details[checkIndex("BOQ Client Number")] ==
                          table_item.Code
                        ) {
                          prevDetails[index][checkIndex("Conversion")] =
                            item.U_Conversion;

                          prevDetails[index][checkIndex("Unit System")] =
                            uomlist.find((list) => list.value === item.U_Unit)
                              ?.label || item.U_Unit;
                          const type = table_item.U_Type;
                          const selectedIndex = packageInfo.find((info) => {
                            const key = Object.keys(info)[0];
                            return key === type;
                          })?.[type];

                          const selectedCostIndex = packageCostInfo.find(
                            (info) => {
                              const key = Object.keys(info)[0];
                              return key === type;
                            }
                          )?.[type];

                          if (selectedIndex) {
                            prevDetails[index][selectedIndex] = table_item;
                          }

                          if (selectedCostIndex) {
                            if (!prevDetails[index][selectedCostIndex]) {
                              prevDetails[index][selectedCostIndex] =
                                table_item?.U_PackRate?.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                );
                            }
                          }
                        }
                      }
                    });
                  }

                  if (prevDetails) {
                    prevDetails.forEach((item, index) => {
                      const Quantity_Client = parseFloat(
                        item[checkIndex("Quantity Client")]
                      );

                      if (!isNaN(Quantity_Client)) {
                        const Material = parseFloat(
                          item[checkIndex("Material Unit Rate")]
                        );
                        const Comsumable = parseFloat(
                          item[checkIndex("Consumable Unit Rate")]
                        );
                        const Equipment = parseFloat(
                          item[checkIndex("Equipment Unit Rate")]
                        );
                        const Specialized = parseFloat(
                          item[
                            checkIndex("Specialized/ Sub-Contract Unit Rate")
                          ]
                        );
                        const Labour = parseFloat(
                          item[checkIndex("Labour Unit Rate")]
                        );
                        const Formwork = parseFloat(
                          item[checkIndex("Formwork Unit Rate")]
                        );
                        const LabTest = parseFloat(
                          item[checkIndex("Lab Test Unit Rate")]
                        );

                        const Material_Multiplier =
                          Quantity_Client * (isNaN(Material) ? 0 : Material);
                        const Comsumable_Multiplier =
                          Quantity_Client *
                          (isNaN(Comsumable) ? 0 : Comsumable);
                        const Equipment_Multiplier =
                          Quantity_Client * (isNaN(Equipment) ? 0 : Equipment);
                        const Specialized_Multiplier =
                          Quantity_Client *
                          (isNaN(Specialized) ? 0 : Specialized);
                        const Labour_Multiplier =
                          Quantity_Client * (isNaN(Labour) ? 0 : Labour);
                        const Formwork_Multiplier =
                          Quantity_Client * (isNaN(Formwork) ? 0 : Formwork);
                        const LabTest_Multiplier =
                          Quantity_Client * (isNaN(LabTest) ? 0 : LabTest);

                        prevDetails[index][checkIndex("Material Cost")] =
                          Material_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                        prevDetails[index][checkIndex("Consumable Cost")] =
                          Comsumable_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                        prevDetails[index][checkIndex("Equipment Cost")] =
                          Equipment_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                        prevDetails[index][
                          checkIndex("Specialized/ Sub-Contract Cost")
                        ] = Specialized_Multiplier?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });
                        prevDetails[index][checkIndex("Labour Cost")] =
                          Labour_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                        prevDetails[index][checkIndex("Formwork Cost")] =
                          Formwork_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                        prevDetails[index][checkIndex("Lab Test Cost")] =
                          LabTest_Multiplier?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });

                        const Material_Unit_Rate = isNaN(Material)
                          ? 0
                          : Material;
                        const Comsumable_Unit_Rate = isNaN(Comsumable)
                          ? 0
                          : Comsumable;
                        const Equipment_Unit_Rate = isNaN(Equipment)
                          ? 0
                          : Equipment;
                        const Specialized_Unit_Rate = isNaN(Specialized)
                          ? 0
                          : Specialized;
                        const Labour_Unit_Rate = isNaN(Labour) ? 0 : Labour;
                        const Formwork_Unit_Rate = isNaN(Formwork)
                          ? 0
                          : Formwork;
                        const LabTest_Unit_Rate = isNaN(LabTest) ? 0 : LabTest;

                        const itemTotal =
                          Material_Unit_Rate +
                          Comsumable_Unit_Rate +
                          Equipment_Unit_Rate +
                          Specialized_Unit_Rate +
                          Labour_Unit_Rate +
                          Formwork_Unit_Rate +
                          LabTest_Unit_Rate;

                        prevDetails[index][checkIndex("Unit Rate")] =
                          itemTotal?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });

                        prevDetails[index][checkIndex("Direct Cost")] = (
                          itemTotal * Quantity_Client
                        )?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });

                        prevDetails[index][checkIndex("Unit In-Direct")] = (0.2 * (convertToNumber(prevDetails[index][checkIndex("Unit Rate")]) || 0) || 0)?.toFixed(2);

                        prevDetails[index][checkIndex("Unit BOQ Client")] = ((((prevDetails[index][checkIndex("Unit Selling")] || 0) / (prevDetails[index][checkIndex("Conversion")] || 0) || 0)) * parseNumber(prevDetails[index][checkIndex("Unit Client")]))?.toFixed(2);

                        prevDetails[index][checkIndex("Total Amount Client")] = (((prevDetails[index][checkIndex("Quantity Client")] || 0) * (prevDetails[index][checkIndex("Unit BOQ Client")] || 0) || 0) / parseNumber(prevDetails[index][checkIndex("Unit Client")]))?.toFixed(2);

                        prevDetails[index][checkIndex("Unit Selling")] = ((convertToNumber(prevDetails[index][checkIndex("Unit In-Direct")]) || 0) + (convertToNumber(prevDetails[index][checkIndex("Unit Rate")]) || 0))?.toFixed(2);

                        prevDetails[index][checkIndex("Total ManHours")] = Number((prevDetails[index][checkIndex("Quantity Client")] || 0) * (prevDetails[index][checkIndex("Standard ManHours")] || 0)).toFixed(2);

                      }
                    });
                  }

                  if (prevDetails) {
                    const total = prevDetails.reduce((sum, item) => {
                      const price = parseFloat(
                        convertToNumber(item[checkIndex("Direct Cost")])
                      );
                      return sum + (isNaN(price) ? 0 : price);
                    }, 0);

                    setdoctotal(
                      total?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    );

                    setheaderdata((prevData) => ({
                      ...prevData,
                      total: total?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                    }));
                  }
                  return prevDetails;
                });
              }
            });
          });
        } else {
          if (
            res.data.error.message ===
            "Invalid session or session already timeout."
          ) {
            alert.error(res.data.error.message);
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          } else {
            alert.error(res.data.error.message);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(function (error) {});

    setLoading(false);
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
      .catch(function (error) {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClose3 = () => {
    setShow3(false);
  };

  const handleFileChange = (e) => {
    try {

      const file = e.target.files[0];
      if (!file) new Error("No file Selected")
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });

        console.log(jsonData);

        const srNoRowIndex = jsonData.findIndex((row) => row[0] === "S No");

        let filteredDataArray = [];
        if (srNoRowIndex !== -1) {
          filteredDataArray = jsonData?.slice(srNoRowIndex + 1);
        } else {
          filteredDataArray = jsonData;
        }

        filteredDataArray = filteredDataArray.filter((row) =>
          row.some((cell) => cell !== "")
        );
        console.log("filteredDataArray", filteredDataArray);
        settabledetails(filteredDataArray);
        let cook = localStorage.getItem("cookie");
        getAllOBEDItems(cook);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log("Error Reading File: " + error?.message);

    }
  };

  const getvaluefrominput = (e) => {
    let data = headerdata;
    data[e.target.name] = e.target.value;
    setheaderdata(data);
  };

  const getvaluefromselect = (e, name) => {
    let data = headerdata;
    data[name] = e.value;
    setheaderdata(data);
  };

  const submit = async () => {
    console.log("tabledetails", tabledetails);
    console.log("headerdata", headerdata);
    // let details = [];
    // Add submit logic as needed
  };

  // const PostInFirstDB = async (body) => {
  //   let cook = await localStorage.getItem("cookie");
  //   if (cook) {
  //     await axios
  //       .post(API_TYPES.POST, {
  //         body: JSON.stringify(body),
  //         api: `OEBS`,
  //         cookie: cook,
  //       })
  //       .then(function (res) {
  //         if (res.data.Code) {
  //           alert.success("Operation completed successfully");
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 3000);
  //         } else {
  //           alert.error(JSON.stringify(res.data.error.message));
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // };

  const getmpvalues = (e, index, clientqty, ManHours) => {
    let data = selectedMP;
    data.item.MMP1Collection[index]["UnitRate"] = e.target.value;
    let unitrate = data.item.MMP1Collection[index]["UnitRate"];
    let unitfactor = data.item.MMP1Collection[index]["U_UnitFactor"];
    let wastage = data.item.MMP1Collection[index]["U_Wastage"];
    data.item.MMP1Collection[index]["LineTotal"] =
      ((unitfactor + (unitfactor * wastage) / 100) * clientqty)?.toFixed(2) *
      Number(unitrate || 1);
    data.item[`ùpdate${update + 1}`] = update + 1;
    setUpdate(update + 1);
    let sum = 0;
    data.item.MMP1Collection.forEach((element) => {
      if (element.LineTotal) {
        sum = sum + Number(element.LineTotal);
      }
    });
    data.item["DocTotal"] = sum;
    tabledetails[data.ParentIndex][checkIndex("Material Unit Rate")] = sum;
    tabledetails[data.ParentIndex][checkIndex("Direct Cost")] = Number(
      Number(sum + ManHours)?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["SiteOverHeades"] = Number(
      (
        tabledetails[data.ParentIndex][checkIndex("Direct Cost")] * 0.2
      )?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["HeadOfficeOverHeads"] = Number(
      (
        (tabledetails[data.ParentIndex][checkIndex("Direct Cost")] +
          tabledetails[data.ParentIndex]["SiteOverHeades"]) *
        0.1
      )?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["Escalation"] = Number(
      (
        (tabledetails[data.ParentIndex][checkIndex("Direct Cost")] +
          tabledetails[data.ParentIndex]["HeadOfficeOverHeads"]) *
        0.1
      )?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["Unforeseen"] = Number(
      (
        (tabledetails[data.ParentIndex][checkIndex("Direct Cost")] +
          tabledetails[data.ParentIndex]["Escalation"]) *
        0.05
      )?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["Contingencies"] = Number(
      (
        (tabledetails[data.ParentIndex][checkIndex("Direct Cost")] +
          tabledetails[data.ParentIndex]["Unforeseen"]) *
        0.03
      )?.toFixed(2)
    );
    tabledetails[data.ParentIndex]["Profit"] = Number(
      (
        tabledetails[data.ParentIndex][checkIndex("Direct Cost")] * 0.05
      )?.toFixed(2)
    );
    setselectedMP(data);
  };

  const handlePackageItemModal = async (id, name, packageItem) => {
    setLoading(true);
    let cook = localStorage.getItem("cookie");
    let SAPApi;
    if (packageItem || name) {
      SAPApi = `OMMP?$filter=Code eq '${id}' and U_Type eq '${name}'`;
      setModalType("OMMP");
    } else {
      SAPApi = `OBED?$filter=Code eq '${id}'`;
      setModalType("OBED");
    }
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        if (res.data.value) {
          if (res.data.value?.length === 0) {
            alert.error(
              `Nothing Found with '${id}' Code ${
                name ? "and Type '" + name + "'" : ""
              }`
            );
          } else {
            setPackageData(res.data.value[0]);
            setIsOpen(true);
          }
        } else {
          if (
            res.data.error.message ===
            "Invalid session or session already timeout."
          ) {
            alert.error(res.data.error.message);
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          } else {
            alert.error(res.data.error.message);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(function (error) {});
  };

  const truncateLine = (value) => {
    if (typeof value !== "string" || !value) return;
    const len = value.length;
    if (len < 20) return value;
    else return `${value?.slice(0, 20)} ...`;
  };

  // const getTableInputValue = (e, index) => {
  //   console.log(e.target.value, index);
  // };

  useEffect(() => {
    const data = Array.from({ length: tableHeaders.length }).map(() => "");
    settabledetails((prev) => {
      return prev?.length === 0 || !prev ? [data] : prev;
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Loader visible={loading} />
      {modalType === "OBED" ? (
        <ModalForBidElement
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          packageData={packageData}
        />
      ) : (
        <ModalForMaterials
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          packageData={packageData}
        />
      )}

      <Header />

      <div>
        <h1 style={{ textAlign: "center", color: "#c32127", margin: "30px" }}>
          Bidding System
        </h1>
      </div>
      <div className="main_container">
        <div className="left">
          <div className="header_items_container">
            <label>Quotation No</label>
            <input type="email" readOnly className="input" />
          </div>
          <div className="header_items_container">
            <label>Client Name</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="clientname"
              type="text"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Contract Type</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="Contracttype"
              type="text"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Construction Period</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="constructionperiod"
              type="text"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Owner Furnished Material</label>
            <Select
              menuPortalTarget={document.body}
              styles={CustomSelect}
              name="FurnishedMaterial"
              displayValue="name"
              isMulti
              options={[
                { label: "Cement", value: "C" },
                { label: "Steel", value: "S" },
                { label: "Other", value: "O" },
              ]}
            />
          </div>
          <div className="header_items_container">
            <label>Escalation</label>
            <Select
              name="Escalation"
              menuPortalTarget={document.body}
              styles={CustomSelect}
              options={[
                { label: "Rebar", value: "Rebar" },
                { label: "Cement", value: "Cement" },
                { label: "Diesel", value: "Diesel" },
                { label: "Petrol", value: "Petrol" },
                { label: "Labour", value: "Labour" },
                { label: "Masan", value: "Masan" },
              ]}
              displayValue="name"
            />
          </div>
          <div className="header_items_container">
            <label>Site OverHeads</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="siteoverheads"
              type="input"
              className="input"
            />
          </div>
        </div>
        <div className="right">
          <div className="header_items_container">
            <label>Received Date</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="receiveddate"
              type="date"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Submission Date</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="submissiondate"
              type="date"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Profit</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              name="profit"
              type="input"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>PST</label>
            <Select
              menuPortalTarget={document.body}
              styles={CustomSelect}
              onChange={(e) => getvaluefromselect(e, "PST")}
              options={[
                { label: "Sindh 13%", value: 13 },
                { label: "KPK 15%", value: 15 },
                { label: "Punjab 16%", value: 16 },
                { label: "Balochistan 15%", value: 15 },
              ]}
              displayValue="name"
            />
          </div>
          <div className="header_items_container">
            <label>Income Tax</label>
            <input
              defaultValue={headerdata?.incomtax + "%"}
              type="input"
              onChange={(e) => getvaluefrominput(e)}
              name="incomtax"
              readOnly
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Project Location</label>
            <input
              type="input"
              onChange={(e) => getvaluefrominput(e)}
              name="location"
              className="input"
            />
          </div>
          <div className="header_items_container">
            <label>Total</label>
            <input
              type="input"
              value={doctotal}
              name="total"
              className="input text-right"
            />
          </div>
          <div className="header_items_container">
            <div className="header_item">
              <input
                onChange={() => setSubContractMode((prevMode) => !prevMode)}
                value={subContractMode}
                name="Contracttype"
                type="checkbox"
                id="contract_mode"
              />
              <label htmlFor="contract_mode">Subcontract</label>
            </div>
            <div></div>
          </div>
        </div>
        <Modal show={show3} onHide={handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>Material Package Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="main_container">
              <div className="left">
                <div className="header_items_container">
                  <label>Material Package Code</label>
                  <input
                    type="email"
                    readOnly
                    value={selectedMP?.value}
                    className="input"
                  />
                </div>
                <div className="header_items_container">
                  <label>Name</label>
                  <input
                    readOnly
                    value={selectedMP?.item.U_Comments}
                    type="text"
                    className="input"
                  />
                </div>
                <div className="header_items_container">
                  <label>Code</label>
                  <input
                    readOnly
                    value={selectedMP?.item.U_CCode}
                    type="text"
                    className="input"
                  />
                </div>
                <div className="header_items_container">
                  <label>Quantity</label>
                  <input
                    readOnly
                    value={selectedMP?.ClientQty}
                    type="text"
                    className="input"
                  />
                </div>
                <div className="header_items_container">
                  <label>Total</label>
                  <input
                    value={selectedMP?.item.DocTotal}
                    name="receiveddate"
                    type="text"
                    className="input"
                  />
                </div>
              </div>
            </div>
            <div className="table_container" style={fixedtablediv}>
              <Table striped bordered hover>
                <thead style={fixedtableheader}>
                  <tr style={{ ...fixedtablerow, background: "#0b9fc8" }}>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>#</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Material Type</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>UoM</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Unit Factor</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Wastage %</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Required Quantity</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Unit Rate</div>
                    </th>
                    <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                      <div>Total Amount</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMP &&
                    selectedMP.item.MMP1Collection.map((item, index) => (
                      <tr key={`${index}`}>
                        <td>
                          <div className="inside_td">{index + 1}</div>
                        </td>
                        <td>
                          <div className="inside_td">{item.U_MTCode}</div>
                        </td>
                        <td>
                          <div className="inside_td">{item.U_Unit}</div>
                        </td>
                        <td>
                          <div className="inside_td">{item.U_UnitFactor}</div>
                        </td>
                        <td>
                          <div className="inside_td">{item.U_Wastage}</div>
                        </td>
                        <td>
                          <div className="inside_td">
                            {(
                              (item.U_UnitFactor +
                                (item.U_UnitFactor * item.U_Wastage) / 100) *
                              selectedMP?.ClientQty
                            )?.toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <div className="inside_td">
                            <input
                              onChange={(e) =>
                                getmpvalues(
                                  e,
                                  index,
                                  selectedMP?.ClientQty,
                                  selectedMP?.ManHours
                                )
                              }
                              name="UnitRate"
                              type="number"
                              style={{ border: "none", borderColor: "#ffffff" }}
                              className="input"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="inside_td">{item.LineTotal}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <div className="button_main_container">
              <button
                type="button"
                className="custombutton"
                tabIndex="0"
                onClick={handleClose3}
              >
                OK
              </button>
              <button type="button" className="custombutton">
                Cancel
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className="button_main_container">
        <button
          type="button"
          className="custombutton"
          onClick={handleButtonClick}
        >
          Import File
        </button>
        <input
          type="file"
           accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="table_container" style={fixedtablediv}>
        {tabledetails && tabledetails.length > 0 ? (
          <Table striped bordered hover id="bidding_system_table">
            <thead style={fixedtableheader}>
              <tr style={{ ...fixedtablerow, background: "#0b9fc8" }}>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    style={{ backgroundColor: "#0b9fc8", color: "white" }}
                  >
                    <div>{header}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabledetails.map((item, index) => (
                <tr key={index + 1}>
                  <td>
                    <div className="inside_td">{index + 1}</div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("BOQ Client Number")] && (
                        <ImArrowRight
                          style={{ cursor: "pointer", marginRight: "6px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("BOQ Client Number")]
                            );
                          }}
                        />
                      )}
                      <span>{item[checkIndex("BOQ Client Number")]}</span>
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">{item[checkIndex("Group")]}</div>
                  </td>
                  <td>
                    <div
                      style={{
                        // maxWidth: "400px",
                        whiteSpace: "nowrap",
                        padding: "0 8px",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "block !important",
                      }}
                      title={item[checkIndex("BOQ Description")]}
                    >
                      {item[checkIndex("BOQ Description")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Unit Client")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Quantity Client")]
                        ? item[checkIndex("Quantity Client")]?.toFixed(2)
                        : null}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Conversion")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Unit System")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Quantity System")]
                        ? typeof item[checkIndex("Quantity System")] ===
                          "number"
                          ? item[checkIndex("Quantity System")]?.toFixed(2)
                          : item[checkIndex("Quantity System")]
                        : null}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Standard ManHours")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Total ManHours")]}
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      {item[checkIndex("Rate ManHours")]}
                    </div>
                  </td>
                  {/* <td>
                    <div className="inside_td">
                      {item[checkIndex("SubContractor Labour")] ? item[checkIndex("SubContractor Labour")]?.toFixed(2) : null}
                      <input
                        type="text"
                        disabled={!subContractMode}
                        value={item[checkIndex("SubContractor Labour")] || ""}
                        onChange={(e) =>
                          getTableInputValue(e, checkIndex("SubContractor Labour"))
                        }
                        name="value"
                        className="form-control"
                      />
                    </div>
                  </td> */}
                  <td>
                    {item[checkIndex("Material Package")]?.U_Package && (
                      <div
                        className="inside_td"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Material Package")]?.U_PackageName ||
                          item[checkIndex("Material Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Material Package")]?.U_Package,
                              "M",
                              true
                            );
                          }}
                        />
                        <div>
                          {truncateLine(
                            item[checkIndex("Material Package")]
                              ?.U_PackageName ||
                              item[checkIndex("Material Package")]?.U_Package
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Consumable Package")]?.U_Package && (
                      <div
                        className="inside_td text-center"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Consumable Package")]
                            ?.U_PackageName ||
                          item[checkIndex("Consumable Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Consumable Package")]?.U_Package,
                              "C",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Consumable Package")]
                            ?.U_PackageName ||
                            item[checkIndex("Consumable Package")]?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Equipment Package")]?.U_Package && (
                      <div
                        className="inside_td text-center"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Equipment Package")]
                            ?.U_PackageName ||
                          item[checkIndex("Equipment Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Equipment Package")]?.U_Package,
                              "E",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Equipment Package")]
                            ?.U_PackageName ||
                            item[checkIndex("Equipment Package")]?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Specialized/ Sub-Contract")]
                      ?.U_Package && (
                      <div
                        className="inside_td"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Specialized/ Sub-Contract")]
                            ?.U_PackageName ||
                          item[checkIndex("Specialized/ Sub-Contract")]
                            ?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Specialized/ Sub-Contract")]
                                ?.U_Package,
                              "S",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Specialized/ Sub-Contract")]
                            ?.U_PackageName ||
                            item[checkIndex("Specialized/ Sub-Contract")]
                              ?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Labour Package")]?.U_Package && (
                      <div
                        className="inside_td"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Labour Package")]?.U_PackageName ||
                          item[checkIndex("Labour Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Labour Package")]?.U_Package,
                              "L",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Labour Package")]?.U_PackageName ||
                            item[checkIndex("Labour Package")]?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Formwork Package")]?.U_Package && (
                      <div
                        className="inside_td"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Formwork Package")]?.U_PackageName ||
                          item[checkIndex("Formwork Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Formwork Package")]?.U_Package,
                              "FW",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Formwork Package")]?.U_PackageName ||
                            item[checkIndex("Formwork Package")]?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {item[checkIndex("Lab Test Package")]?.U_Package && (
                      <div
                        className="inside_td"
                        style={{ justifyContent: "left", padding: "2px 6px" }}
                        title={
                          item[checkIndex("Lab Test Package")]?.U_PackageName ||
                          item[checkIndex("Lab Test Package")]?.U_Package
                        }
                      >
                        <ImArrowRight
                          style={{ cursor: "pointer", paddingRight: "8px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item[checkIndex("Lab Test Package")]?.U_Package,
                              "LT",
                              true
                            );
                          }}
                        />
                        {truncateLine(
                          item[checkIndex("Lab Test Package")]?.U_PackageName ||
                            item[checkIndex("Lab Test Package")]?.U_Package
                        )}
                      </div>
                    )}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Material Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Material Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Consumable Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Consumable Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Equipment Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Equipment Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Specialized/ Sub-Contract Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Specialized/ Sub-Contract Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Labour Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Labour Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Formwork Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Formwork Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Lab Test Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Lab Test Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Unit Rate")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Direct Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Unit In-Direct")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("In-Direct Cost")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Unit Selling")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Selling Price")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Unit BOQ Client")]}
                  </td>
                  <td className="text-right">
                    {item[checkIndex("Total Amount Client")]}
                  </td>
                  {/* <td className="text-right">{item[checkIndex("Amount")]}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover>
            <thead style={fixedtableheader}>
              <tr style={{ ...fixedtablerow, background: "#0b9fc8" }}>
                {tableHeaders?.map((item) => (
                  <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                    <div>{item}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabledetails &&
                tabledetails.map((item, index) => (
                  <tr key={`${index}`}>
                    {item?.map((subitem) => (
                      <td>
                        <div className="inside_td">{subitem}</div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </div>
      <div className="button_main_container">
        <div>
          <button
            type="button"
            className="custombutton"
            tabIndex="0"
            onClick={submit}
          >
            Add
          </button>
        </div>
        <div>
          {tabledetails?.length > 0 && tabledetails[0][0] && (
            <button
              onClick={() =>
                exportTableToXLSX(
                  "bidding_system_table",
                  "bidding_system_table.xlsx"
                )
              }
            >
              Export to Excel
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Bidding;
