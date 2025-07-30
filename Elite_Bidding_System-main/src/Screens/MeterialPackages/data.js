const data = {
  Code: "214195044",
  U_Comments: "Rebar DEFORMED  GR-60",
  U_DocTotal: "3680.00",
  U_Type: "C",
  MMP1Collection: [
    {
      U_MTCode: "1115036001",
      U_MTName: null,
      U_Unit: 31,
      U_UnitFactor: 0.0,
      U_Wastage: 0.0,
      U_Quantity: 40.0,
      U_Amount: 480.0,
      U_Rate: 0.0,
    },
    {
      Code: "214195044",
      LineId: 2,
      Object: "OMMP",
      LogInst: null,
      U_MTCode: "1365049502",
      U_MTName: null,
      U_Unit: 4,
      U_UnitFactor: 0.0,
      U_Wastage: 0.0,
      U_Quantity: 8.0,
      U_Price: 400.0,
      U_Amount: 3200.0,
      U_Rate: 0.0,
    },
  ],
};


// ------------------------------------------------------
// ----------- For Patch ---------------- //

const patchData = {
  U_Comments: "Rebar DEFORMED  GR-60",
  U_DocTotal: "3680.00",
  MMP1Collection: [
      {
          Code: "214195044",
          LineId: 1,
          U_UnitFactor: 0.0,
          U_Wastage: 0.0,
          U_Quantity: 40.0,
          U_Amount: 480.0,
          U_Rate: 0.0
      },
  ]
}