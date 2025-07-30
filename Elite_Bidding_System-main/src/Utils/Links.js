// console.log(process.env.REACT_App_LOCAL)

const LINKS = {
  // --------Local Working----------
  api: `${process.env.REACT_App_LOCAL}${process.env.REACT_App_PORT}`,
  SERVER_GET: `${process.env.REACT_App_LOCAL}${process.env.REACT_App_PORT}/GetApi`,
  SERVER_POST: `${process.env.REACT_App_LOCAL}${process.env.REACT_App_PORT}/POSTApi`,
  SERVER_PATCH: `${process.env.REACT_App_LOCAL}${process.env.REACT_App_PORT}/PATCHApi`,
  SERVER_Delete: `${process.env.REACT_App_LOCAL}${process.env.REACT_App_PORT}/DeleteApi`,
  sap: {
    MasterData: {
      ActvieDimensions: `Dimensions?$filter=IsActive eq 'tYES'`,
      GetDefaultReport: `ReportLayoutsService_GetDefaultReport`,
      GetInstallationNo: `LicenseService_GetInstallationNumber`,
      ActiveResources: `Resources`,
      ActiveRouteStage: `RouteStages`,
      ActiveAccounts: `ChartOfAccounts?$select=Code,Name`,
      AllTaxGroups: `VatGroups`,
      AllProductTree: `ProductTrees`,
      AllProjects: `Projects`,
      ActiveAllItems: `Items?$select=ItemCode,ItemName,ItemsGroupCode,PurchaseUnit&$filter=Valid eq 'tYES' &$orderby=ItemCode`,
      AllActiveItems: `Items?$select=ItemCode,ItemName,ItemsGroupCode,ManageBatchNumbers,ItemWarehouseInfoCollection,PurchaseUnit&$filter=Valid eq 'tYES' &$orderby=ItemCode`,
      FGAllActiveItems: `Items?$select=ItemCode,ItemName,ItemsGroupCode,ManageBatchNumbers,ItemWarehouseInfoCollection,PurchaseUnit&$filter=Valid eq 'tYES' and ItemsGroupCode eq 131 &$orderby=ItemCode`,
      ActivePurchaseItems: `Items?$select=ItemCode,ItemName,PurchaseItem,PurchaseUnit,ManageBatchNumbers&$filter=PurchaseItem eq 'tYES' and Valid eq 'tYES' and CapitalizationDate eq Null&$orderby=ItemCode `,
      ActiveSalesItems: `Items?$select=ItemCode,BarCode,ItemName,ItemsGroupCode,ItemWarehouseInfoCollection,SalesUnit&$filter=Valid eq 'tYES'&$orderby=ItemCode`,
      ActiveInventoryItems: `Items?$select=ItemCode,ItemName,InventoryUOM&$filter=InventoryItem eq 'tYES' and Valid eq 'tYES'&$orderby=ItemCode`,
      ActiveUsers: `Users?$select=InternalKey,UserCode,UserName,eMail,MobilePhoneNumber,Branch,Department&$filter=Locked eq 'tNO'&$orderby=UserCode`,
      ActiveCostingCode: `ProfitCenters?$select=CenterCode,CenterName&$filter=Active eq 'tYES' and GroupCode ne null&$orderby=CenterCode`,
      ActiveEmplyeeInfo: `EmployeesInfo?$select=EmployeeID,LastName,FirstName,eMail,MiddleName&$filter=Active eq 'tYES'&$orderby=EmployeeID`,
      ActiveProjects: `Projects?$select=Code,Name&$filter=Active eq 'tYES' &$orderby=Code`,
      ActiveSalesEmployee: `SalesPersons?$select=SalesEmployeeCode,SalesEmployeeName&$filter=Locked eq 'tNO' and Active eq 'tYES'&$orderby=SalesEmployeeCode`,
      ActiveBranches: `BusinessPlaces?$select=BPLID, BPLName&$filter=Disabled eq 'tNO'&$orderby=BPLID`,
      ActiveVendor: `BusinessPartners?$select=CardCode,Currency,CardName&$filter=CardType eq 'cSupplier' and Valid eq 'tYES'&$orderby=CardCode`,
      ActiveCustomer: `BusinessPartners?$select=CardCode,BilltoDefault,ShipToDefault,Address,Currency,CardName,Phone1&$filter=CardType eq 'cCustomer' and Valid eq 'tYES'&$orderby=CardCode`,
      ActiveWarehouse: `Warehouses?$select=WarehouseCode,WarehouseName&$orderby=WarehouseCode`,
      ActivePurchaseTax: `VatGroups?$select=Code,Name,VatGroups_Lines&$filter=Inactive eq 'tNO' and Category eq 'bovcInputTax'`,
      ActiveSalesTax: `VatGroups?$select=Code,Name,VatGroups_Lines&$filter=Inactive eq 'tNO' and Category eq 'bovcOutputTax'`,
      Freight: `AdditionalExpenses`,
      Departments: `Departments`,
      ContactPerson: `BusinessPartners?$select=CardCode,ContactPerson&$filter=CardCode eq `,
    },
  },
};
export default LINKS;
