import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "./index.css";
import {
  Loader,
  CustomSelect,
  TableCustomStyle,
  Header,
  fixedtablediv,
  fixedtableheader,
  fixedtablerow,
} from "../../Utils";
import { Table } from "react-bootstrap";
import LINKS from "../../Utils/Links";
import axios from "axios";
import CustomModal from "../Common/Modal";
import { useAlert } from "react-alert";
import { ImArrowRight } from "react-icons/im";
import ModalForMaterials from "../Common/ModalForMaterials";

function BidElement({ propsData }) {
  const alert = useAlert();
  const codeRef = useRef();
  const fileInputRef = useRef(null);
  const [SelectedItems, setSelectedItems] = useState([{ abc: "abc" }]);
  const [headerdata, setheaderdata] = useState({ incomtax: "" });
  const [loading, setLoading] = useState(false);
  const [type, settype] = useState();
  const [uomlist, setuomlist] = useState();
  const [searchModal, setSearchModal] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedTypeList, setSelectedTypeList] = useState([]);
  const [populatedItemsLength, setPopulatedItemsLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [doctotal, setdoctotal] = useState(0);

  const [contextMenu, setContextMenu] = useState(null);
  const menuRef = useRef(null);

  const API_TYPES = {
    GET: `${LINKS.api}/GetApi`,
    POST: `${LINKS.api}/POSTApi`,
    PATCH: `${LINKS.api}/PATCHApi`,
    SECONDPOST: `${LINKS.api}/SecondDBPOSTApi`,
  };

  function getDocTotal(array) {
    if (array?.length == 0) return 0;
    const stringArr = array.map((item) => item?.U_PackRate);
    const sum = stringArr.reduce((prev, next) => {
      const num = parseFloat(next);
      return !isNaN(num) ? prev + num : prev;
    }, 0);
    return sum ? sum?.toFixed() : 0;
  }

  useEffect(() => {
    let cook = localStorage.getItem("cookie");
    if (cook) {
      getunitofmeasure(cook);
    }
    if (propsData) {
      setheaderdata(propsData);
      setSelectedItems(propsData?.BED1Collection);
      setdoctotal(getDocTotal(propsData?.BED1Collection));
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const getunitofmeasure = async (cook) => {
    // -------------------------    Items API GET DATA   ------------------------------------------------------
    let SAPApi = `UnitOfMeasurements?$select=Code,Name,AbsEntry`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        // console.log("uom res.data.value", res.data.value);
        if (res.data.value) {
          let ItemsDropDown = [];
          res.data.value.forEach((element) => {
            ItemsDropDown.push({
              value: element.AbsEntry,
              label: element.Name,
            });
          });
          setuomlist(ItemsDropDown);
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(function (error) {});
  };

  const getvaluefrominput = (e) => {
    const { name, value } = e.target;

    // if(isUpdating && name === "Code" && !!value && value !== "*"){
    //   return
    // }

    setheaderdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const tablegetvaluefrominput = (e, index, type) => {
  //   let updatedDetails = SelectedItems;

  //   updatedDetails[index][e.target.name] =
  //     type == "text" ? e.target.value : parseFloat(e.target.value);
  //   setSelectedItems(updatedDetails);

  //   console.log({ updatedDetails });
  // };

  const tablegetvaluefrominput = (e, index, type) => {
    let updatedDetails = [...SelectedItems];

    updatedDetails[index] = {
      ...updatedDetails[index],
      [e.target.name]:
        type === "text" ? e.target.value : parseFloat(e.target.value) || 0,
    };

    setSelectedItems(updatedDetails);

    setdoctotal(getDocTotal(updatedDetails));

    // console.log({ updatedDetails });
  };

  const validateData = (body) => {
    console.log({ body });

    if (!body?.Code) {
      alert.error("Code is required.");
      return false;
    }
    if (!body?.Name) {
      alert.error("Name is required.");
      return false;
    }
    if (!body?.U_Unit) {
      alert.error("Unit is required.");
      return false;
    }
    if (!body?.U_Conversion) {
      alert.error("Conversion is required.");
      return false;
    }
    if (!body?.BED1Collection || body?.BED1Collection.length === 0) {
      alert.error("At least one item must be selected.");
      return false;
    }

    for (const item of body?.BED1Collection) {
      if (!item.U_Type || !item.U_Package || !item.U_PackRate) {
        // Check for null or undefined
        alert.error("All item fields (Type, Package, PackRate) are required.");
        return false;
      }
    }

    return true;
  };

  const submit = async () => {
    console.log("tabledetails", SelectedItems);
    console.log("headerdata", headerdata);

    let details = [];
    SelectedItems?.forEach((item) => {
      item.U_Type &&
        details.push({
          U_Type: item.U_Type,
          U_Package: item.U_Package,
          U_PackageName: item.U_PackageName,
          U_PackRate: item.U_PackRate,
        });
    });

    let body = {
      U_DocTotal: doctotal,
      Code: headerdata?.Code,
      Name: headerdata?.U_Comments || headerdata?.Name,
      U_Unit: headerdata?.U_Unit,
      U_Conversion: headerdata?.U_Conversion,
      BED1Collection: details,
    };

    console.log("body", body);

    if (!validateData(body)) return; // Validate data before proceeding

    PostInFirstDB(body);
  };

  const PostInFirstDB = async (body) => {
    setLoading(true);
    let cook = await localStorage.getItem("cookie");
    if (cook) {
      await axios
        .post(API_TYPES.POST, {
          body: JSON.stringify(body),
          api: `OBED`,
          cookie: cook,
        })
        .then(function (res) {
          if (res.data.Code) {
            alert.success("Operation completed successfully");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            alert.error(JSON.stringify(res.data.error.message));
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch(function (error) {});
      setLoading(false);
    }
  };
  const submitPatch = async (U_Package, callback) => {
    console.log("tabledetails", SelectedItems);
    console.log("headerdata", headerdata);

    let details = [];
    SelectedItems?.forEach((item) => {
      if (U_Package === item.U_Package) return;
      item.U_Type &&
        details.push({
          U_Type: item.U_Type,
          U_Package: item.U_Package,
          U_PackageName: item.U_PackageName,
          U_PackRate: item.U_PackRate,
        });
    });

    const sum = getDocTotal(details);

    let body = {
      U_DocTotal: sum,
      Code: headerdata?.Code,
      Name: headerdata?.U_Comments || headerdata?.Name,
      U_Unit: headerdata?.U_Unit,
      U_Conversion: headerdata?.U_Conversion,
      BED1Collection: details,
    };

    setdoctotal(sum);

    console.log("body", body);

    if (!validateData(body)) return; // Validate data before proceeding

    PatchInFirstDB(headerdata?.Code, body, callback);
    // setLoading(false);
  };

  const PatchInFirstDB = async (id, body, callback) => {
    setLoading(true);
    let cook = await localStorage.getItem("cookie");
    if (cook) {
      await axios
        .post(API_TYPES.PATCH, {
          body: JSON.stringify(body),
          api: `OBED('${id}')`,
          cookie: cook,
        })
        .then(function (res) {
          if (res.data === "update") {
            callback && callback();
            alert.success("Operation completed successfully");
          } else {
            alert.error(JSON.stringify(res.data.error.message));
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch(function (error) {});
    }
  };

  const fetchAllData = async (cook) => {
    setLoading(true);
    console.log("fetching all data...");
    let SAPApi = `OBED?$select=Code,Name,U_Conversion,U_DocTotal,U_Unit,BED1Collection`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        if (res.data.value) {
          console.log("res for search ", res.data.value);

          setSearchData(res.data.value);
          setSearchModal(true);
          setLoading(false);
        }
      })
      .catch(function (error) {})
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchFilteredData = async (value, cook) => {
    setLoading(true);
    console.log("fetching filtered data...");
    setSearchData([]);
    let SAPApi = `OBED?$filter=Code eq '${encodeURIComponent(value)}'`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        console.log("res for search", res.data);
        if (res.data.value) {
          const itemData = res.data.value[0];

          if (itemData) {
            setheaderdata(itemData);

            setdoctotal(getDocTotal(itemData.BED1Collection));

            const items = itemData.BED1Collection.map((item) => {
              return {
                U_PackRate: item.U_PackRate,
                U_Package: item.U_Package,
                U_PackageName: item.U_PackageName,
                U_Type: item.U_Type,
              };
            });

            setSelectedItems([...items, {}]);
            setPopulatedItemsLength(items.length);
            setIsUpdating(true);
          } else {
            setheaderdata({
              U_DocTotal: "",
              Name: "",
              U_Unit: "",
              U_Conversion: "",
            });
            setdoctotal(0);
            setSelectedItems([{}]);
            setIsUpdating(false);
            alert.error(`Nothing Found For, With ${value} Code!!!`);
          }

          //   setSearchData(res.data.value);
          //   setSearchModal(true);
          setLoading(false);
        }
      })
      .catch(function (error) {})
      .finally(() => {
        setLoading(false);
      });
  };

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

  const typesoptions = [
    { label: "Material Package", value: "M" },
    { label: "Consumable Package", value: "C" },
    { label: "Equipment Package", value: "E" },
    { label: "Specialized Package", value: "S" },
    { label: "Labour Package", value: "L" },
    { label: "Formwork Package", value: "FW" },
    { label: "Lab Test Package", value: "LT" },
  ];

  const handlePopulatePackageDataFromSearch = (itemData) => {
    setheaderdata(itemData);

    // setSelectedTypeList()

    setdoctotal(getDocTotal(itemData.BED1Collection));

    const items = itemData.BED1Collection.map((item, index) => {
      handleSelectType(item.U_Type, index);
      handleSelect(item, index, item.U_Type);
      return {
        U_PackRate: item.U_PackRate,
        U_Package: item.U_Package,
        U_PackageName: item.U_PackageName,
        U_Type: item.U_Type,
      };
    });

    setSelectedItems([...items, {}]);
    setPopulatedItemsLength(items.length);
    setSearchModal(false);
    setIsUpdating(true);
  };

  const handleSelectType = async (value, index) => {
    setLoading(true);

    // // Check for cached data
    // const cachedData = cacheUtils.getCache(value);
    // if (cachedData) {
    //   setData(cachedData);
    //   const newItems = cachedData.map((item) => ({
    //     label: `${item?.Code} - ${item.U_Comments}`,
    //     value: item?.Code,
    //   }));
    //   updateSelectedTypeList(newItems, index);
    //   setLoading(false);
    //   return;
    // }

    let cook = localStorage.getItem("cookie");
    let SAPApi = `OMMP?$filter=U_Type eq '${value}' &$select=Code,U_Comments,Name,U_DocTotal`;

    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        if (res.data.value) {
          setData(res.data.value);

          // cacheUtils.setCache(value, res.data.value); // Cache the new data

          const newItems =
            res.data.value?.map((item) => ({
              label: `${item?.Code} - ${item.U_Comments}`,
              value: item?.Code,
            })) || [];

          updateSelectedTypeList(newItems, index);
          setSelectedItems((prevItems) => {
            prevItems[index].U_Type = value;
            return prevItems;
          });
          setLoading(false);
        } else {
          handleError(res.data.error);
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  const updateSelectedTypeList = (newItems, index) => {
    setSelectedTypeList((prevList) => {
      const updatedList = [...prevList];
      if (
        !updatedList[index] ||
        !newItems.every(
          (item, idx) => item.label === updatedList[index][idx]?.label
        ) ||
        newItems.length === 0
      ) {
        updatedList[index] = newItems;
      }
      return updatedList;
    });
  };

  const handleError = (error) => {
    if (error.message === "Invalid session or session already timeout.") {
      alert.error(error.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } else {
      alert.error(error.message);
    }
  };

  const handleSelect = (item, index, typeValue) => {
    if (typeValue) {
      settype(typeValue);
    }

    const filteredObj = data?.find(
      (element) => element.Code === item.value || element.U_Type === item.value
    );

    if (filteredObj) {
      const updatedItems = [...SelectedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        U_Package: item.value,
        U_PackageName: item.label?.split(" - ")[1],
        U_PackRate: filteredObj.U_DocTotal,
        U_Type: typeValue,
      };

      setdoctotal(getDocTotal(updatedItems));
      setSelectedItems(
        Object.keys(updatedItems?.at(-1)).length === 0
          ? [...updatedItems]
          : [...updatedItems, {}]
      );
    } else {
      const updatedItems = [...SelectedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        U_PackageName: "",
        U_PackRate: "",
        U_Package: "",
        U_Type: typeValue,
      };

      setSelectedItems(
        Object.keys(updatedItems?.at(-1)).length === 0
          ? [...updatedItems]
          : [...updatedItems, {}]
      );
    }
  };

  const handlePackageItemModal = async (id, name) => {
    console.log({ id, name });
    setLoading(true);

    let cook = localStorage.getItem("cookie");
    let SAPApi = `OMMP?$filter=Code eq '${id}' and U_Type eq '${name}'`;
    await axios
      .post(API_TYPES.GET, {
        api: SAPApi,
        cookie: cook,
      })
      .then(function (res) {
        if (res.data.value) {
          if (res.data.value?.length === 0) {
            alert.error(`Nothing Found with '${id}' Code`);
          } else {
            console.log("handlePackageItemModal", res.data);
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
    setLoading(false);
  };

  // Show context menu at cursor position
  const handleContextMenu = (event, index, U_Package) => {
    // if (!isUpdating) return;
    if (!U_Package && !headerdata?.Code) return;

    event.preventDefault();

    const menuWidth = 150;
    const menuHeight = 50;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let x = event.clientX;
    let y = event.clientY;

    // Prevent menu from going off the right edge
    if (x + menuWidth > screenWidth) {
      x = screenWidth - menuWidth - 10;
    }

    // Prevent menu from going off the bottom edge
    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight - 10;
    }

    setContextMenu({
      x,
      y,
      index,
      U_Package,
    });
  };

  // Remove item from list
  const handleRemoveItem = async (U_Package, index) => {
    console.log({ U_Package, index });
    submitPatch(U_Package, () => {
      setSelectedItems((prevItems) => {
        return prevItems?.filter((_, i) => i !== index);
      });
      setContextMenu(null);
    });
  };

  // Close menu when clicking anywhere on the body
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setContextMenu(null);
    }
  };

  // Attach event listener to the whole body
  useEffect(() => {
    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <>
      <Loader visible={loading} />

      <ModalForMaterials
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        packageData={packageData}
      />

      {!propsData && <Header />}

      <CustomModal
        title={"List of Bid Element"}
        isOpen={searchModal}
        setIsOpen={() => setSearchModal(false)}
      >
        {
          <Table striped bordered hover className="table">
            <thead>
              <tr className="table_header_row">
                <th>Sr#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Conversion</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {!!searchData ? (
                searchData?.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handlePopulatePackageDataFromSearch(item)}
                    className="table_body_row"
                  >
                    <td>{index + 1}</td>
                    <td>{item?.Code}</td>
                    <td>{item.Name}</td>
                    <td>
                      {uomlist?.find((uom) => uom.value === item.U_Unit)?.label}
                    </td>
                    <td>{item.U_Conversion}</td>
                    <td>{item.U_DocTotal}</td>
                  </tr>
                ))
              ) : (
                <tr>No Search Data</tr>
              )}
            </tbody>
          </Table>
        }
      </CustomModal>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <p>
            Are you sure you want to remove this item? [{contextMenu.U_Package}]
          </p>
          <button
            className="context-menu-button"
            onClick={() =>
              handleRemoveItem(contextMenu.U_Package, contextMenu.index)
            }
          >
            Remove Item
          </button>
        </div>
      )}

      <div>
        <h1 style={{ textAlign: "center", color: "#c32127", margin: "30px" }}>
          Bid Element
        </h1>
      </div>

      <div className="main_container">
        <div className="left">
          <div className="header_items_container">
            <label>Code</label>
            <input
              ref={codeRef}
              type="email"
              value={headerdata.Code}
              onChange={(e) => getvaluefrominput(e)}
              onKeyDown={handleSearchKeyDown}
              className="input code_input"
              name="Code"
            />
          </div>

          <div className="header_items_container">
            <label>Name</label>
            <input
              onChange={(e) => getvaluefrominput(e)}
              value={headerdata.U_Comments || headerdata.Name}
              name="U_Comments"
              type="text"
              className="input"
            />
          </div>
        </div>

        <div className="right">
          <div className="header_items_container">
            <label>Conversion</label>
            <input
              // disabled
              name="U_Conversion"
              type="input"
              className="input"
              value={headerdata.U_Conversion}
              onChange={(e) => getvaluefrominput(e)}
            />
          </div>

          <div className="header_items_container">
            <label>Unit</label>
            <Select
              name="Type"
              menuPortalTarget={document.body}
              styles={CustomSelect}
              value={uomlist?.find((uom) => uom.value === headerdata.U_Unit)}
              onChange={(e) => {
                setheaderdata((prevData) => ({
                  ...prevData,
                  U_Unit: e?.value,
                }));
              }}
              options={uomlist}
            />
          </div>

          <div className="header_items_container">
            <label>Total</label>
            <input
              disabled
              onChange={(e) => getvaluefrominput(e)}
              value={doctotal}
              name="U_DocTotal"
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
                <div># </div>
              </th>
              <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                <div>Type</div>
              </th>
              <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                <div>Code</div>
              </th>
              <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                <div>Name</div>
              </th>
              <th style={{ backgroundColor: "#0b9fc8", color: "white" }}>
                <div>Price</div>
              </th>
              {/* <th style={{ backgroundColor: '#0b9fc8', color: 'white' }}><div>Total Amount</div></th> */}
            </tr>
          </thead>
          <tbody>
            {SelectedItems &&
              SelectedItems.map((item, index) => (
                <tr
                  key={`${index}`}
                  onContextMenu={(e) =>
                    handleContextMenu(e, index, item?.U_Package)
                  }
                >
                  <td>
                    <div className="inside_td">{index + 1}</div>
                  </td>

                  <td>
                    <div className="inside_td">
                      <Select
                        menuPortalTarget={document.body}
                        styles={TableCustomStyle}
                        name="Type"
                        onChange={(e) => {
                          handleSelectType(e.value, index);
                          handleSelect(e, index, e.value);
                        }}
                        value={typesoptions?.filter(
                          (option) => option.value === item.U_Type
                        )}
                        options={typesoptions}
                      />
                    </div>
                  </td>

                  <td>
                    {/* {(item.U_Package && populatedItemsLength > index) ||
                    (item.U_Package && propsData) ? ( */}
                    {item.U_Package &&
                    populatedItemsLength > index &&
                    selectedTypeList[index]?.filter(
                      (list) => list.value === item?.U_Package
                    ).length === 0 ? (
                      <>
                        <ImArrowRight
                          style={{ cursor: "pointer", marginRight: "6px" }}
                          onClick={() => {
                            handlePackageItemModal(
                              item?.U_Package,
                              item?.U_Type
                            );
                          }}
                        />
                        {item.U_Package}
                      </>
                    ) : (
                      <>
                        {selectedTypeList[index] && (
                          <div className="inside_td">
                            {selectedTypeList[index]?.filter(
                              (list) => list.value === item?.U_Package
                            ).length !== 0 ? (
                              <ImArrowRight
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handlePackageItemModal(
                                    item?.U_Package,
                                    item?.U_Type
                                  );
                                }}
                              />
                            ) : (
                              <></>
                            )}
                            <Select
                              menuPortalTarget={document.body}
                              styles={TableCustomStyle}
                              name="Code"
                              onChange={(e) => {
                                handleSelect(e, index, type);
                              }}
                              value={selectedTypeList[index]?.filter(
                                (list) => list.value === item?.U_Package
                              )}
                              options={selectedTypeList[index]}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </td>

                  {/* <td>{item.U_PackageName}</td> */}
                  <td>
                    <div className="inside_td">
                      <input
                        type="text"
                        disabled
                        value={item?.U_PackageName || ""}
                        // onChange={(e) =>
                        //   tablegetvaluefrominput(e, index, "text")
                        // }
                        name="U_PackageName"
                        className="form-control"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="inside_td">
                      <input
                        type="number"
                        // min={0}
                        value={item.U_PackRate || ""}
                        onChange={(e) =>
                          tablegetvaluefrominput(e, index, "number")
                        }
                        name="U_PackRate"
                        className="form-control"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      {!propsData && (
        <div className="button_main_container">
          <button
            type="button"
            className="custombutton"
            tabIndex="0"
            onClick={isUpdating ? submitPatch : submit}
          >
            {isUpdating ? "Update" : "Add"}
          </button>
          <button type="button" className="custombutton">
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

export default BidElement;
