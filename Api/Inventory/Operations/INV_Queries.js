var config = require("../Connection/INV_DbConfig");
const sql = require("mssql");

async function getInventorys(page = 1, pageSize = 20) {
  try {
    let pool = await sql.connect(config);

    // Calculate the offset (which record to start from)
    const offset = (page - 1) * pageSize;

    // Query for the paginated data
    const query = `
          SELECT * FROM Inventory
          ORDER BY ItemNum
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY;
      `;

    const countQuery = `SELECT COUNT(*) AS totalRecords FROM Inventory`;

    // Execute the paginated query and the count query
    const result = await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(query);

    const countResult = await pool.request().query(countQuery);
    const totalRecords = countResult.recordset[0].totalRecords;

    // Return the paginated result and the total count
    return {
      data: result.recordset,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  } catch (error) {
    console.log("Error fetching inventory data:", error);
    throw error;
  }
}

async function get_Vendor_Items_Page(Vendor_Number, page = 1, pageSize = 20) {
  try {
    let pool = await sql.connect(config);

    // Calculate the offset (which record to start from)
    const offset = (page - 1) * pageSize;

    // Query for the paginated data
    const query = `
          SELECT IV.*, I.ItemName 
          FROM Inventory_Vendors as IV 
          INNER JOIN Inventory as I 
          ON IV.ItemNum = I.ItemNum 
          WHERE IV.Vendor_Number = @Vendor_Number
          ORDER BY IV.ItemNum
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY;
      `;

    // Query to count total records for pagination
    const countQuery = `
          SELECT COUNT(*) AS totalRecords 
          FROM Inventory_Vendors as IV 
          INNER JOIN Inventory as I 
          ON IV.ItemNum = I.ItemNum 
          WHERE IV.Vendor_Number = @Vendor_Number;
      `;

    // Execute the paginated query and the count query
    const result = await pool
      .request()
      .input("Vendor_Number", sql.NVarChar, Vendor_Number)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(query);

    const countResult = await pool
      .request()
      .input("Vendor_Number", sql.NVarChar, Vendor_Number)
      .query(countQuery);

    const totalRecords = countResult.recordset[0].totalRecords;

    // Return the paginated result and the total count
    return {
      data: result.recordset,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  } catch (error) {
    console.log(error);
  }
}

async function getInventoryNoPg(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query("SELECT TOP 100 * from Inventory WHERE IsDeleted = 0");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getLotteryTotalValue(Dept_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Dept_ID", sql.NVarChar, Dept_ID)
      .query(
        "SELECT SUM(CASE WHEN Price IS NOT NULL AND In_Stock IS NOT NULL AND Dept_ID = @Dept_ID THEN Price * In_Stock ELSE 0 END) AS TotalPrice FROM Inventory WHERE Dept_ID = @Dept_ID AND Price IS NOT NULL AND In_Stock IS NOT NULL"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getLatestSoldItems() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT TOP 10 * FROM Invoice_Itemized ORDER BY Invoice_Number DESC"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_All_Trans_History() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query("SELECT * FROM Invoice_Itemized ORDER BY Invoice_Number DESC");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Inventory_Reference_ID(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "SELECT COALESCE(MAX(ID + 1), 1) AS MaxValue FROM Inventory_Reference"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Invoice_ID() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT COALESCE(MAX(Invoice_Number + 1), 1) AS MaxValue FROM Invoice_Totals"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_Exist_Location(Dept_ID, Location) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Dept_ID", sql.NVarChar, Dept_ID)
      .input("Location", sql.NVarChar, Location)
      .query(
        "SELECT * From Inventory WHERE Dept_ID = @Dept_ID AND Location = @Location AND IsDeleted = 0"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Empoloyee_Permission(Cashier_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Cashier_ID", sql.NVarChar, Cashier_ID)
      .query("SELECT * FROM Employee WHERE Cashier_ID = @Cashier_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function login_Employee(Cashier_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Cashier_ID", sql.NVarChar, Cashier_ID)
      .query("SELECT * FROM Employee WHERE Cashier_ID = @Cashier_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_All_Employee() {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request().query("SELECT * FROM Employee");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Purchase_Orders(POType) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("POType", sql.NVarChar, POType)
      .query(
        "SELECT PO_Summary.*, Vendors.First_Name, Vendors.Last_Name, Vendors.Company, Vendors.Address_1, Vendors.Address_2, Vendors.City, Vendors.State, Vendors.Zip_Code, Vendors.Phone, Vendors.Fax, Vendors.Vendor_Tax_ID, Vendors.Vendor_Terms, Vendors.SSN, Vendors.Commission, Vendors.Rent, Vendors.County, Vendors.Country, Vendors.Email, Vendors.Website, Vendors.Minimum_Order, Vendors.Default_Ordering_Mode, Vendors.Default_Billable_Department, Vendors.Default_PO_Delivery FROM PO_Summary INNER JOIN Vendors ON PO_Summary.Vendor_Number = Vendors.Vendor_Number WHERE PO_Summary.POType = @POType"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Purchase_Orders_Unique(PO_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("PO_Number", sql.NVarChar, PO_Number)
      .query(
        "SELECT PO_Summary.*, Vendors.First_Name, Vendors.Last_Name, Vendors.Company, Vendors.Address_1, Vendors.Address_2, Vendors.City, Vendors.State, Vendors.Zip_Code, Vendors.Phone, Vendors.Fax, Vendors.Vendor_Tax_ID, Vendors.Vendor_Terms, Vendors.SSN, Vendors.Commission, Vendors.Rent, Vendors.County, Vendors.Country, Vendors.Email, Vendors.Website, Vendors.Minimum_Order, Vendors.Default_Ordering_Mode, Vendors.Default_Billable_Department, Vendors.Default_PO_Delivery FROM PO_Summary INNER JOIN Vendors ON PO_Summary.Vendor_Number = Vendors.Vendor_Number WHERE PO_Summary.PO_Number = @PO_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Purchase_Orders_Items(PO_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("PO_Number", sql.NVarChar, PO_Number)
      .query(
        "SELECT PO_Details.*, Inventory.ItemName FROM PO_Details INNER JOIN Inventory ON PO_Details.ItemNum = Inventory.ItemNum WHERE PO_Details.PO_Number = @PO_Number AND Inventory.IsDeleted = 0"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Vendor_Items(Vendor_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Vendor_Number", sql.NVarChar, Vendor_Number)
      .query(`SELECT IV.*, I.ItemName, I.Dept_ID, IA.Brand, IA.SubCategory
              FROM Inventory_Vendors AS IV 
              LEFT JOIN Inventory AS I ON IV.ItemNum = I.ItemNum 
              LEFT JOIN Inventory_AdditionalInfo AS IA ON IV.ItemNum = IA.ItemNum
              WHERE IV.Vendor_Number = @Vendor_Number AND I.IsDeleted = 0`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Vendor_Items_All() {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request()
      .query(`SELECT IV.*, I.ItemName, I.Dept_ID, IA.Brand, IA.SubCategory
              FROM Inventory_Vendors AS IV 
              LEFT JOIN Inventory AS I ON IV.ItemNum = I.ItemNum 
              LEFT JOIN Inventory_AdditionalInfo AS IA ON IV.ItemNum = IA.ItemNum`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Vendor_Items_Assign(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "SELECT IV.*, I.ItemName FROM Inventory_Vendors as IV INNER JOIN Inventory as I ON IV.ItemNum = I.ItemNum WHERE IV.ItemNum = @ItemNum"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getAllvendoritems_Pagination(page = 1, pageSize = 20) {
  try {
    let pool = await sql.connect(config);

    // Calculate the offset (which record to start from)
    const offset = (page - 1) * pageSize;

    // Query for the paginated data with the JOIN
    const query = `
          SELECT IV.*, I.ItemName 
          FROM Inventory_Vendors AS IV
          INNER JOIN Inventory AS I ON IV.ItemNum = I.ItemNum
          ORDER BY IV.ItemNum
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY;
      `;

    // Query to get the total record count
    const countQuery = `
          SELECT COUNT(*) AS totalRecords
          FROM Inventory_Vendors AS IV
          INNER JOIN Inventory AS I ON IV.ItemNum = I.ItemNum
      `;

    // Execute the paginated query and the count query
    const result = await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(query);

    const countResult = await pool.request().query(countQuery);
    const totalRecords = countResult.recordset[0].totalRecords;

    // Return the paginated result and the total count
    return {
      data: result.recordset,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  } catch (error) {
    console.log("Error fetching inventory data:", error);
    throw error;
  }
}

async function get_All_Vendor_Items() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT IV.*, I.ItemName FROM Inventory_Vendors as IV INNER JOIN Inventory as I ON IV.ItemNum = I.ItemNum WHERE I.IsDeleted = 0"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Vendor_Items_By_ItemNum(Vendor_Number, ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Vendor_Number", sql.NVarChar, Vendor_Number)
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "SELECT * FROM Inventory_Vendors WHERE Vendor_Number = @Vendor_Number AND ItemNum = @ItemNum"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Setup_TS_Buttons_Index(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "SELECT COALESCE(MAX([Index] + 1), 1) AS MaxValue FROM Setup_TS_Buttons"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventory(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request().input("ItemNum", sql.NVarChar, ItemNum)
      .query(`select TOP 1 I.*,
   ISNULL( I.Tax_1,0)Tax_1,ISNULL( I.Tax_2,0)Tax_2, ISNULL(I.Tax_3,0)Tax_3,ISNULL(I.Tax_4,0)Tax_4,ISNULL(I.Tax_5,0)Tax_5,ISNULL(I.Tax_6,0)Tax_6,
  TX.Tax1_Rate,TX.Tax2_Rate,TX.Tax3_Rate,TX.Tax4_Rate,TX.Tax5_Rate,TX.Tax6_Rate from Tax_Rate TX, Inventory I 
   LEFT JOIN Inventory_SKUS Sku ON I.ItemNum = Sku.ItemNum 
 WHERE i.ItemNum = @ItemNum OR Sku.AltSKU = @ItemNum AND IsDeleted = 0`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventoryByDepID(Dept_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Dept_ID", sql.NVarChar, Dept_ID)
      .query(
        "select * from Inventory where Dept_ID = @Dept_ID AND IsDeleted = 0 ORDER BY Location ASC"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getLotteryInvoiceDetails(ItemNum, Datetime) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("Datetime", sql.NVarChar, Datetime)
      .query(
        "SELECT ii.* FROM Invoice_Totals it INNER JOIN Invoice_Itemized ii ON it.Invoice_Number = ii.Invoice_Number WHERE CAST(it.Datetime AS DATETIME) BETWEEN @Datetime AND GETDATE() AND ii.ItemNum = @ItemNum"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getVendors() {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request().query("SELECT * from Vendors");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getReasonCodes(Reason_Type) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .query(
        "select * from Setup_Reason_Codes where Reason_Type = @Reason_Type"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getReasonCodes(Reason_Type) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .query(
        "select * from Setup_Reason_Codes where Reason_Type = @Reason_Type"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function DeleteReasonCode(Reason_Type, Reason_Code) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .input("Reason_Code", sql.NVarChar, Reason_Code)
      .query(
        "DELETE FROM Setup_Reason_Codes WHERE Reason_Type = @Reason_Type AND Reason_Code = @Reason_Code"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

// Function to insert a new item into Inventory
async function CreacteBarcode(itemData) {
  //  console.log(itemData);

  try {
    let pool = await sql.connect(config);
    let insertQuery = `
          INSERT INTO [dbo].[Inventory] (
              ItemNum, ItemName, Store_ID, Cost, Price, Retail_Price, In_Stock, Reorder_Level,
              Reorder_Quantity, Tax_1, Tax_2, Tax_3, Vendor_Number, Dept_ID, IsKit, IsModifier,
              Kit_Override, Inv_Num_Barcode_Labels, Use_Serial_Numbers, Num_Bonus_Points, IsRental,
              Use_Bulk_Pricing, Print_Ticket, Print_Voucher, Num_Days_Valid, IsMatrixItem,
              Vendor_Part_Num, Location, AutoWeigh, numBoxes, Dirty, Tear, NumPerCase,
              FoodStampable, ReOrder_Cost, Helper_ItemNum, ItemName_Extra, Exclude_Acct_Limit,
              Check_ID, Old_InStock, Date_Created, ItemType, Prompt_Price, Prompt_Quantity,
              Inactive, Allow_BuyBack, Last_Sold, Unit_Type, Unit_Size, Fixed_Tax, DOB,
              Special_Permission, Prompt_Description, Check_ID2, Count_This_Item, Transfer_Cost_Markup,
              Print_On_Receipt, Transfer_Markup_Enabled, As_Is, InStock_Committed, RequireCustomer,
              PromptCompletionDate, PromptInvoiceNotes, Prompt_DescriptionOverDollarAmt,
              Exclude_From_Loyalty, BarTaxInclusive, ScaleSingleDeduct, GLNumber, ModifierType,
              Position, numberOfFreeToppings, ScaleItemType, DiscountType, AllowReturns, SuggestedDeposit,
              Liability, IsDeleted, ItemLocale, QuantityRequired, AllowOnDepositInvoices,
              Import_Markup, PricePerMeasure, UnitMeasure, ShipCompliantProductType, AlcoholContent,
              AvailableOnline, AllowOnFleetCard, DoughnutTax, DisplayTaxInPrice, NeverPrintInKitchen,
              RowID, Tax_4, Tax_5, Tax_6, DisableInventoryUpload, InvoiceLimitQty, ItemCategory,
              IsRestrictedPerInvoice, TagStatus
          ) VALUES (
              @ItemNum, @ItemName, @Store_ID, @Cost, @Price, @Retail_Price, @In_Stock, @Reorder_Level,
              @Reorder_Quantity, @Tax_1, @Tax_2, @Tax_3, @Vendor_Number, @Dept_ID, @IsKit, @IsModifier,
              @Kit_Override, @Inv_Num_Barcode_Labels, @Use_Serial_Numbers, @Num_Bonus_Points, @IsRental,
              @Use_Bulk_Pricing, @Print_Ticket, @Print_Voucher, @Num_Days_Valid, @IsMatrixItem,
              @Vendor_Part_Num, @Location, @AutoWeigh, @numBoxes, @Dirty, @Tear, @NumPerCase,
              @FoodStampable, @ReOrder_Cost, @Helper_ItemNum, @ItemName_Extra, @Exclude_Acct_Limit,
              @Check_ID, @Old_InStock, @Date_Created, @ItemType, @Prompt_Price, @Prompt_Quantity,
              @Inactive, @Allow_BuyBack, @Last_Sold, @Unit_Type, @Unit_Size, @Fixed_Tax, @DOB,
              @Special_Permission, @Prompt_Description, @Check_ID2, @Count_This_Item, @Transfer_Cost_Markup,
              @Print_On_Receipt, @Transfer_Markup_Enabled, @As_Is, @InStock_Committed, @RequireCustomer,
              @PromptCompletionDate, @PromptInvoiceNotes, @Prompt_DescriptionOverDollarAmt,
              @Exclude_From_Loyalty, @BarTaxInclusive, @ScaleSingleDeduct, @GLNumber, @ModifierType,
              @Position, @numberOfFreeToppings, @ScaleItemType, @DiscountType, @AllowReturns, @SuggestedDeposit,
              @Liability, @IsDeleted, @ItemLocale, @QuantityRequired, @AllowOnDepositInvoices,
              @Import_Markup, @PricePerMeasure, @UnitMeasure, @ShipCompliantProductType, @AlcoholContent,
              @AvailableOnline, @AllowOnFleetCard, @DoughnutTax, @DisplayTaxInPrice, @NeverPrintInKitchen,
              @RowID, @Tax_4, @Tax_5, @Tax_6, @DisableInventoryUpload, @InvoiceLimitQty, @ItemCategory,
              @IsRestrictedPerInvoice, @TagStatus
          );
      `;

    let request = pool.request();
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function CreacteInventory_In(itemData) {
  try {
    let pool = await sql.connect(config);
    let insertQuery = `
         INSERT INTO [dbo].[Inventory_In] (
             ItemNum, Store_ID, Quantity, CostPer, DateTime, Vendor_Number, Dirty, TransType, Destination, Description, Cashier_ID, PO_Number, Delivery_Number
         ) VALUES (
             @ItemNum, @Store_ID, @Quantity, @CostPer, @DateTime, @Vendor_Number, @Dirty, @TransType, @Destination, @Description, @Cashier_ID, @PO_Number, @Delivery_Number
         );
     `;

    let request = pool.request();
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const response = await request.query(insertQuery);
    //    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_Inventory_Entry(
  inventoryData,
  additionalInfoData,
  setupTsButtonData,
  InventoryRefData,
  InventoryBumpbarData
) {
  //console.log(inventoryData, additionalInfoData, setupTsButtonData, InventoryRefData, InventoryBumpbarData);

  let pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Inventory
    let insertInventoryQuery = `
          INSERT INTO [dbo].[Inventory] (
              ItemNum, ItemName, Store_ID, Cost, Price, Retail_Price, In_Stock, Reorder_Level,
              Reorder_Quantity, Tax_1, Tax_2, Tax_3, Vendor_Number, Dept_ID, IsKit, IsModifier,
              Kit_Override, Inv_Num_Barcode_Labels, Use_Serial_Numbers, Num_Bonus_Points, IsRental,
              Use_Bulk_Pricing, Print_Ticket, Print_Voucher, Num_Days_Valid, IsMatrixItem,
              Vendor_Part_Num, Location, AutoWeigh, numBoxes, Dirty, Tear, NumPerCase,
              FoodStampable, ReOrder_Cost, Helper_ItemNum, ItemName_Extra, Exclude_Acct_Limit,
              Check_ID, Old_InStock, Date_Created, ItemType, Prompt_Price, Prompt_Quantity,
              Inactive, Allow_BuyBack, Last_Sold, Unit_Type, Unit_Size, Fixed_Tax, DOB,
              Special_Permission, Prompt_Description, Check_ID2, Count_This_Item, Transfer_Cost_Markup,
              Print_On_Receipt, Transfer_Markup_Enabled, As_Is, InStock_Committed, RequireCustomer,
              PromptCompletionDate, PromptInvoiceNotes, Prompt_DescriptionOverDollarAmt,
              Exclude_From_Loyalty, BarTaxInclusive, ScaleSingleDeduct, GLNumber, ModifierType,
              Position, numberOfFreeToppings, ScaleItemType, DiscountType, AllowReturns, SuggestedDeposit,
              Liability, IsDeleted, ItemLocale, QuantityRequired, AllowOnDepositInvoices,
              Import_Markup, PricePerMeasure, UnitMeasure, ShipCompliantProductType, AlcoholContent,
              AvailableOnline, AllowOnFleetCard, DoughnutTax, DisplayTaxInPrice, NeverPrintInKitchen,
              RowID, Tax_4, Tax_5, Tax_6, DisableInventoryUpload, InvoiceLimitQty, ItemCategory,
              IsRestrictedPerInvoice, TagStatus
          ) VALUES (
              @ItemNum, @ItemName, @Store_ID, @Cost, @Price, @Retail_Price, @In_Stock, @Reorder_Level,
              @Reorder_Quantity, @Tax_1, @Tax_2, @Tax_3, @Vendor_Number, @Dept_ID, @IsKit, @IsModifier,
              @Kit_Override, @Inv_Num_Barcode_Labels, @Use_Serial_Numbers, @Num_Bonus_Points, @IsRental,
              @Use_Bulk_Pricing, @Print_Ticket, @Print_Voucher, @Num_Days_Valid, @IsMatrixItem,
              @Vendor_Part_Num, @Location, @AutoWeigh, @numBoxes, @Dirty, @Tear, @NumPerCase,
              @FoodStampable, @ReOrder_Cost, @Helper_ItemNum, @ItemName_Extra, @Exclude_Acct_Limit,
              @Check_ID, @Old_InStock, @Date_Created, @ItemType, @Prompt_Price, @Prompt_Quantity,
              @Inactive, @Allow_BuyBack, @Last_Sold, @Unit_Type, @Unit_Size, @Fixed_Tax, @DOB,
              @Special_Permission, @Prompt_Description, @Check_ID2, @Count_This_Item, @Transfer_Cost_Markup,
              @Print_On_Receipt, @Transfer_Markup_Enabled, @As_Is, @InStock_Committed, @RequireCustomer,
              @PromptCompletionDate, @PromptInvoiceNotes, @Prompt_DescriptionOverDollarAmt,
              @Exclude_From_Loyalty, @BarTaxInclusive, @ScaleSingleDeduct, @GLNumber, @ModifierType,
              @Position, @numberOfFreeToppings, @ScaleItemType, @DiscountType, @AllowReturns, @SuggestedDeposit,
              @Liability, @IsDeleted, @ItemLocale, @QuantityRequired, @AllowOnDepositInvoices,
              @Import_Markup, @PricePerMeasure, @UnitMeasure, @ShipCompliantProductType, @AlcoholContent,
              @AvailableOnline, @AllowOnFleetCard, @DoughnutTax, @DisplayTaxInPrice, @NeverPrintInKitchen,
              @RowID, @Tax_4, @Tax_5, @Tax_6, @DisableInventoryUpload, @InvoiceLimitQty, @ItemCategory,
              @IsRestrictedPerInvoice, @TagStatus
          );
      `;
    let inventoryRequest = transaction.request();
    for (let key in inventoryData) {
      inventoryRequest.input(key, sql.NVarChar, inventoryData[key]); // Adjust data type as needed
    }
    await inventoryRequest.query(insertInventoryQuery);

    // Inventory Additional
    let insertAdditionalInfoQuery = `
          INSERT INTO [dbo].[Inventory_AdditionalInfo] (
              Store_ID, ItemNum, ExtendedDescription, Keywords, Brand, Theme, 
              SubCategory, LeadTime, ProductOnPromotionPreOrder, ProductOnSpecialOffer, 
              NewProduct, Discountable, WebPrice, ReleaseDate, Weight, NoWebSales, 
              IsPrimaryMatrixItem, Priority, Rating, CustomNumber1, CustomNumber2, 
              CustomNumber3, CustomNumber4, CustomNumber5, CustomText1, CustomText2, 
              CustomText3, CustomText4, CustomText5, CustomExtendedText1, CustomExtendedText2, 
              SubDescription1, SubDescription2, SubDescription3
          ) VALUES (
              @Store_ID, @ItemNum, @ExtendedDescription, @Keywords, @Brand, @Theme, 
              @SubCategory, @LeadTime, @ProductOnPromotionPreOrder, @ProductOnSpecialOffer, 
              @NewProduct, @Discountable, @WebPrice, @ReleaseDate, @Weight, @NoWebSales, 
              @IsPrimaryMatrixItem, @Priority, @Rating, @CustomNumber1, @CustomNumber2, 
              @CustomNumber3, @CustomNumber4, @CustomNumber5, @CustomText1, @CustomText2, 
              @CustomText3, @CustomText4, @CustomText5, @CustomExtendedText1, @CustomExtendedText2, 
              @SubDescription1, @SubDescription2, @SubDescription3
          );
      `;

    let additionalInfoRequest = transaction.request();
    for (let key in additionalInfoData) {
      additionalInfoRequest.input(key, sql.NVarChar, additionalInfoData[key]);
    }

    await additionalInfoRequest.query(insertAdditionalInfoQuery);

    // SetupTSButton
    let SetupTSButton = `
      INSERT INTO [dbo].[Setup_TS_Buttons] (
          Store_ID, Station_ID, [Index], Caption, Picture, [Function], 
          Option1, BackColor, ForeColor, Visible, BtnType, Ident, 
          ScheduleIndex, Option2, Option3, Option4, HideCaption
      ) VALUES (
          @Store_ID, @Station_ID, @Index, @Caption, @Picture, @Function, 
          @Option1, @BackColor, @ForeColor, @Visible, @BtnType, @Ident, 
          @ScheduleIndex, @Option2, @Option3, @Option4, @HideCaption
      );
      `;
    let SetupTSButtonRequest = transaction.request();

    for (let key in setupTsButtonData) {
      SetupTSButtonRequest.input(key, sql.NVarChar, setupTsButtonData[key]);
    }
    await SetupTSButtonRequest.query(SetupTSButton);

    // Inventory Refrence
    let InventoryReference = `
          INSERT INTO [dbo].[Inventory_Reference] (
              ID, ItemNum, Store_ID
          ) VALUES (
              @ID, @ItemNum, @Store_ID
          );
      `;

    let InventoryReferenceRequest = transaction.request();

    for (let key in InventoryRefData) {
      InventoryReferenceRequest.input(key, sql.NVarChar, InventoryRefData[key]);
    }

    await InventoryReferenceRequest.query(InventoryReference);

    //Bumpbar Settings
    let InventoryBumpbar = `
          INSERT INTO [dbo].[Inventory_BumpBarSettings] (
              Store_ID, ItemNum, Backcolor, Forecolor
          ) VALUES (
              @Store_ID, @ItemNum, @Backcolor, @Forecolor
          );
      `;

    let InventoryBumpbarRequest = transaction.request();

    for (let key in InventoryBumpbarData) {
      InventoryBumpbarRequest.input(
        key,
        sql.NVarChar,
        InventoryBumpbarData[key]
      );
    }

    await InventoryBumpbarRequest.query(InventoryBumpbar);

    // Commit the transaction
    await transaction.commit();
    console.log("Inventory and Additional Info inserted successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Error inserting data:", error);
  } finally {
    sql.close(); // Make sure to close the connection
  }
}

async function Create_Setup_TS_Buttons(itemData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Setup_TS_Buttons
    let insertQuery = `
          INSERT INTO [dbo].[Setup_TS_Buttons] (
              Store_ID, Station_ID, [Index], Caption, Picture, [Function], 
              Option1, BackColor, ForeColor, Visible, BtnType, Ident, 
              ScheduleIndex, Option2, Option3, Option4, HideCaption
          ) VALUES (
              @Store_ID, @Station_ID, @Index, @Caption, @Picture, @Function, 
              @Option1, @BackColor, @ForeColor, @Visible, @BtnType, @Ident, 
              @ScheduleIndex, @Option2, @Option3, @Option4, @HideCaption
          );
      `;

    let request = pool.request();
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_Inventory_Reference(itemData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query
    let insertQuery = `
          INSERT INTO [dbo].[Inventory_Reference] (
              ID, ItemNum, Store_ID
          ) VALUES (
              @ID, @ItemNum, @Store_ID
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the itemData object and add each key-value pair as an input parameter
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    // console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}

async function Create_Inventory_SKUS(itemData) {
  // console.log("itemData called", itemData);
  try {
    const pool = await sql.connect(config);

    const existingItems = await getInventory(itemData.AltSKU);

    if (existingItems[0]?.length > 0) {
      throw new Error("Item already exists");
    }

    // SQL INSERT query
    const insertQuery = `
          INSERT INTO [dbo].[Inventory_SKUS] (
              Store_ID, ItemNum, AltSKU
          ) VALUES (
              @Store_ID, @ItemNum, @AltSKU
          );
      `;

    const request = pool.request();
    request.input("Store_ID", sql.NVarChar, itemData.Store_ID);
    request.input("ItemNum", sql.NVarChar, itemData.ItemNum);
    request.input("AltSKU", sql.NVarChar, itemData.AltSKU);

    await request.query(insertQuery);

    return { success: true, message: "Alt SKU created successfully!" };
  } catch (error) {
    if (
      error.originalError &&
      error.originalError.info &&
      error.originalError.info.message.includes("PRIMARY KEY constraint")
    ) {
      throw new Error("Item already exists");
    }

    throw new Error(error.message || "Failed to create Alt SKU");
  }
}

async function Create_Kit_Index(kitData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Kit_Index
    let insertQuery = `
          INSERT INTO [dbo].[Kit_Index] (
              Kit_ID, Store_ID, ItemNum, Discount, Quantity, [Index], 
              Price, Description, InvoiceMethodToUse, ChoiceLockdown
          ) VALUES (
              @Kit_ID, @Store_ID, @ItemNum, @Discount, @Quantity, @Index, 
              @Price, @Description, @InvoiceMethodToUse, @ChoiceLockdown
          );
      `;

    let request = pool.request();
    // Iterate over each key in kitData and bind it to the request input parameters
    for (let key in kitData) {
      request.input(key, sql.NVarChar, kitData[key]); // You can change sql.NVarChar to appropriate type based on the field
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Update_PO_Details(poData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL UPDATE query for PO_Details
    let updateQuery = `
          UPDATE [dbo].[PO_Details]
          SET 
              [PO_Number] = @PO_Number,
              [ItemNum] = @ItemNum,
              [LineNum] = @LineNum,
              [Quan_Ordered] = @Quan_Ordered,
              [CostPer] = @CostPer,
              [Quan_Received] = @Quan_Received,
              [Vendor_Part_Number] = @Vendor_Part_Number,
              [CasePack] = @CasePack,
              [Store_ID] = @Store_ID,
              [destStore_ID] = @destStore_ID,
              [Current_Batch_Quan] = @Current_Batch_Quan,
              [Quan_Damaged] = @Quan_Damaged,
              [Reason] = @Reason,
              [NumberPerCase] = @NumberPerCase,
              [OverrideCommission] = @OverrideCommission,
              [Quan_OutofDate] = @Quan_OutofDate
          WHERE
              @SearchCondition; -- Ensure you define your search condition logic here (e.g., WHERE PO_Number = @PO_Number or other conditions)
      `;

    let request = pool.request();
    // Iterate over each key in poData and bind it to the request input parameters
    for (let key in poData) {
      request.input(key, sql.NVarChar, poData[key]); // Change to appropriate types like sql.BigInt, sql.Float, etc.
    }

    // Execute the query
    const response = await request.query(updateQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_Reason_Code(reasonData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Setup_Reason_Codes
    let insertQuery = `
          INSERT INTO [dbo].[Setup_Reason_Codes] (
              Store_ID, Reason_Code, Reason_Type
          ) VALUES (
              @Store_ID, @Reason_Code, @Reason_Type
          );
      `;

    let request = pool.request();

    // Iterate over each key in reasonData and bind it to the request input parameters
    for (let key in reasonData) {
      // Determine the appropriate data type based on each field's type
      if (key === "Store_ID" || key === "Reason_Code") {
        request.input(key, sql.NVarChar, reasonData[key]);
      } else if (key === "Reason_Type") {
        request.input(key, sql.SmallInt, reasonData[key]);
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_Inventory_Vendor(inventoryData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Inventory_Vendors
    let insertQuery = `
          INSERT INTO [dbo].[Inventory_Vendors] (
              ItemNum, Store_ID, Vendor_Number, CostPer, Case_Cost, 
              NumPerVenCase, Vendor_Part_Num, CubeCost, WeightCost, 
              OverrideCommission, LandedCost
          ) VALUES (
              @ItemNum, @Store_ID, @Vendor_Number, @CostPer, @Case_Cost, 
              @NumPerVenCase, @Vendor_Part_Num, @CubeCost, @WeightCost, 
              @OverrideCommission, @LandedCost
          );
      `;

    let request = pool.request();

    // Iterate over each key in inventoryData and bind it to the request input parameters
    for (let key in inventoryData) {
      // Determine the appropriate data type based on each field's type
      switch (key) {
        case "ItemNum":
        case "Store_ID":
        case "Vendor_Part_Num":
          request.input(key, sql.NVarChar, inventoryData[key]);
          break;
        case "Vendor_Number":
          request.input(key, sql.NVarChar, inventoryData[key]);
          break;
        case "CostPer":
        case "Case_Cost":
        case "CubeCost":
        case "WeightCost":
        case "LandedCost":
          request.input(key, sql.Money, inventoryData[key]);
          break;
        case "NumPerVenCase":
          request.input(key, sql.Float, inventoryData[key]);
          break;
        case "OverrideCommission":
          request.input(key, sql.Bit, inventoryData[key]);
          break;
        default:
          console.log(`Unknown field: ${key}`);
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function create_Inventory_TagAlongs(tagAlongData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query with parameter placeholders
    let insertQuery = `
          INSERT INTO [dbo].[Inventory_TagAlongs] (
              ItemNum, Store_ID, TagAlong_ItemNum, Quantity
          ) VALUES (
              @ItemNum, @Store_ID, @TagAlong_ItemNum, @Quantity
          );
      `;

    let request = pool.request();

    // Dynamically bind values from tagAlongData to the request inputs
    for (let key in tagAlongData) {
      // Bind each key from tagAlongData to the corresponding parameter in the query
      if (typeof tagAlongData[key] === "number") {
        if (tagAlongData[key] % 1 === 0) {
          // If the number is an integer, assume it's an integer (e.g., Store_ID)
          request.input(key, sql.Int, tagAlongData[key]);
        } else {
          // Otherwise, it's a float or decimal (e.g., Quantity)
          request.input(key, sql.Decimal(25, 8), tagAlongData[key]);
        }
      } else {
        // For strings, use sql.NVarChar
        request.input(key, sql.NVarChar, tagAlongData[key]);
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_BumpBarSettings(settingsData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Inventory_BumpBarSettings
    let insertQuery = `
          INSERT INTO [dbo].[Inventory_BumpBarSettings] (
              Store_ID, ItemNum, Backcolor, Forecolor
          ) VALUES (
              @Store_ID, @ItemNum, @Backcolor, @Forecolor
          );
      `;

    let request = pool.request();

    // Bind parameters from settingsData with correct SQL types
    request.input("Store_ID", sql.NVarChar, settingsData.Store_ID);
    request.input("ItemNum", sql.NVarChar, settingsData.ItemNum);
    request.input("Backcolor", sql.Int, settingsData.Backcolor);
    request.input("Forecolor", sql.Int, settingsData.Forecolor);

    // Execute the query
    await request.query(insertQuery);
    console.log("Bump Bar Settings inserted successfully");
  } catch (error) {
    console.log("Error inserting Bump Bar Settings:", error);
  }
}

async function Create_Inventory_AdditionalInfo(infoData) {
  // console.log(infoData); // Optional: log the input data for debugging

  try {
    let pool = await sql.connect(config);

    let insertQuery = `
          INSERT INTO [dbo].[Inventory_AdditionalInfo] (
              Store_ID, ItemNum, ExtendedDescription, Keywords, Brand, Theme, 
              SubCategory, LeadTime, ProductOnPromotionPreOrder, ProductOnSpecialOffer, 
              NewProduct, Discountable, WebPrice, ReleaseDate, Weight, NoWebSales, 
              IsPrimaryMatrixItem, Priority, Rating, CustomNumber1, CustomNumber2, 
              CustomNumber3, CustomNumber4, CustomNumber5, CustomText1, CustomText2, 
              CustomText3, CustomText4, CustomText5, CustomExtendedText1, CustomExtendedText2, 
              SubDescription1, SubDescription2, SubDescription3
          ) VALUES (
              @Store_ID, @ItemNum, @ExtendedDescription, @Keywords, @Brand, @Theme, 
              @SubCategory, @LeadTime, @ProductOnPromotionPreOrder, @ProductOnSpecialOffer, 
              @NewProduct, @Discountable, @WebPrice, @ReleaseDate, @Weight, @NoWebSales, 
              @IsPrimaryMatrixItem, @Priority, @Rating, @CustomNumber1, @CustomNumber2, 
              @CustomNumber3, @CustomNumber4, @CustomNumber5, @CustomText1, @CustomText2, 
              @CustomText3, @CustomText4, @CustomText5, @CustomExtendedText1, @CustomExtendedText2, 
              @SubDescription1, @SubDescription2, @SubDescription3
          );
      `;

    let request = pool.request();

    // Dynamically bind parameters from infoData
    for (let key in infoData) {
      // Check if the key exists in the table and bind only valid keys
      if (infoData.hasOwnProperty(key)) {
        request.input(key, sql.NVarChar, infoData[key]); // Default to NVarChar for simplicity
      }
    }

    // Execute the query
    await request.query(insertQuery);
    console.log("Inventory Additional Info inserted successfully");
  } catch (error) {
    console.log("Error inserting Inventory Additional Info:", error);
  }
}

async function UpdateBarcode(itemData) {
  // console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    for (let key in itemData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Inventory]
          SET ${setQueryParts.join(", ")}
          WHERE ItemNum = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating item");
  }
}

async function updateInvoiceTotals(itemData) {
  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    for (let key in itemData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Invoice_Totals]
          SET ${setQueryParts.join(", ")}
          WHERE Invoice_Number = @Invoice_Number;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating item");
  }
}

// async function updateInvoiceTotals(invoiceData, searchCondition) {
//     console.log(invoiceData);

//     try {
//         let pool = await sql.connect(config);

//         // Create an array for the SET clause dynamically based on input data
//         let setQueryParts = [];
//         for (let key in invoiceData) {
//             setQueryParts.push(`${key} = @${key}`);
//         }

//         // Construct the UPDATE query with the dynamic SET clause
//         let updateQuery = `
//             UPDATE [dbo].[Invoice_Totals]
//             SET ${setQueryParts.join(', ')}
//             WHERE ${searchCondition};  -- Replace with your actual search condition
//         `;

//         let request = pool.request();

//         // Add the input parameters dynamically based on invoiceData
//         for (let key in invoiceData) {
//             // You can use proper types for each key, depending on the data you are passing
//             request.input(key, getSqlType(invoiceData[key]), invoiceData[key]);
//         }

//         const result = await request.query(updateQuery);

//         // Debugging: Log the result to check what gets returned
//         console.log(result);

//         // Return result to the calling function
//         return result;

//     } catch (error) {
//         console.log(error);
//         throw new Error('Error updating invoice totals');
//     }
// }

// // Helper function to determine SQL parameter type based on input value
// function getSqlType(value) {
//     if (typeof value === 'string') {
//         return sql.NVarChar;
//     } else if (typeof value === 'number') {
//         return sql.Float;  // This can be adjusted based on the expected number type (e.g., money, real, etc.)
//     } else if (typeof value === 'boolean') {
//         return sql.Bit;
//     } else if (value instanceof Date) {
//         return sql.DateTime;
//     } else {
//         // Handle other types as needed
//         return sql.NVarChar;
//     }
// }

async function UpdatePODetails(poData) {
  // console.log(poData);

  try {
    let pool = await sql.connect(config);

    // Initialize the SET clause dynamically
    let setQueryParts = [];
    for (let key in poData) {
      // Skip the key if it is related to WHERE condition (e.g., PO_Number or ItemNum)
      if (key !== "PO_Number" && key !== "ItemNum") {
        setQueryParts.push(`${key} = @${key}`);
      }
    }

    // Build the WHERE condition dynamically based on PO_Number and ItemNum
    let whereCondition = `WHERE PO_Number = @PO_Number AND ItemNum = @ItemNum`;

    // Build the full update query
    let updateQuery = `
          UPDATE [dbo].[PO_Details]
          SET ${setQueryParts.join(", ")}
          ${whereCondition};
      `;

    let request = pool.request();

    // Add inputs dynamically for all fields in poData
    for (let key in poData) {
      // Set the correct SQL data type based on the field type
      let sqlType;
      switch (typeof poData[key]) {
        case "string":
          sqlType = sql.NVarChar;
          break;
        case "number":
          sqlType = Number.isInteger(poData[key]) ? sql.Int : sql.Float;
          break;
        case "boolean":
          sqlType = sql.Bit;
          break;
        default:
          sqlType = sql.NVarChar; // Default to NVarChar if unsure
      }
      request.input(key, sqlType, poData[key]);
    }

    // Execute the query
    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating PO details");
  }
}

async function UpdateInvoiceItemized(itemData) {
  // console.log(itemData);

  try {
    let pool = await sql.connect(config);

    // Build the SET clause dynamically based on the keys in itemData
    let setQueryParts = [];
    for (let key in itemData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Invoice_Itemized]
          SET ${setQueryParts.join(", ")}
          WHERE Invoice_Number = @Invoice_Number AND ItemNum = @ItemNum;  
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type based on the key
      let value = itemData[key];
      let sqlType = getSqlTypeForKey(key, value); // Function to map data type
      request.input(key, sqlType, value);
    }

    // Execute the query
    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating invoice itemized record");
  }
}

// Helper function to determine the appropriate SQL data type for each field
function getSqlTypeForKey(key, value) {
  switch (key) {
    case "Invoice_Number":
    case "BC_Invoice_Number":
    case "Store_ID":
    case "Cashier_ID_Itemized":
    case "Ticket_Number":
    case "Salesperson":
    case "OnlineLoyalty_OfferId":
      return sql.NVarChar;
    case "LineNum":
    case "Quantity":
    case "CostPer":
    case "PricePer":
    case "Tax1Per":
    case "Tax2Per":
    case "Tax3Per":
    case "LineDisc":
    case "Commission":
    case "origPricePer":
    case "SalePricePer":
    case "PricePerBeforeDiscount":
    case "KitOverride":
    case "KitTotal":
    case "Tax4Per":
    case "Tax5Per":
    case "Tax6Per":
      return sql.Decimal(25, 8);
    case "Line_Tax_Exempt":
    case "IsRental":
    case "FixedTaxPer":
    case "ComboApplied":
    case "SentToKitchen":
    case "Line_Tax_Exempt_2":
    case "Line_Tax_Exempt_3":
    case "Line_Tax_Exempt_4":
    case "Line_Tax_Exempt_5":
    case "Line_Tax_Exempt_6":
    case "modifierPriceLock":
    case "Special_Price_Lock":
    case "As_Is":
    case "Returned":
    case "Line_Tax_Exempt_3":
      return sql.Bit;
    case "GC_Sold":
    case "DOB":
    case "SecurityDeposit":
    case "Liability":
      return sql.Money;
    case "NumScans":
    case "numBonus":
    case "ReturnedQuantity":
    case "ScaleItemType":
    case "OrigPriceSetBy":
    case "PriceChangedBy":
    case "KitOverride":
    case "KitTotal":
    case "GC_Free":
      return sql.Int;
    case "Tare":
      return sql.Float;
    default:
      return sql.NVarChar; // Default to string for unknown fields
  }
}

async function UpdateItemizeQuanity(itemData) {
  // console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    for (let key in itemData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Inventory]
          SET ${setQueryParts.join(", ")}
          WHERE ItemNum = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating item");
  }
}

async function UpdateKitIndex(itemData) {
  // console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keys
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Kit_Index]
          SET ${setQueryParts.join(", ")}
          WHERE [ItemNum] = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type for each column
      // You can adjust the data types based on your table's structure
      if (key === "Discount") {
        request.input(key, sql.Real, itemData[key]);
      } else if (key === "Quantity" || key === "Price") {
        request.input(key, sql.Float, itemData[key]);
      } else if (
        key === "Kit_ID" ||
        key === "Store_ID" ||
        key === "ItemNum" ||
        key === "Description"
      ) {
        request.input(key, sql.NVarChar, itemData[key]);
      } else if (
        key === "Index" ||
        key === "InvoiceMethodToUse" ||
        key === "ChoiceLockdown"
      ) {
        request.input(key, sql.Int, itemData[key]);
      } else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating Kit_Index");
  }
}

async function UpdateInventoryAdditionalInfo(itemData) {
  // console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keys
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Inventory_AdditionalInfo]
          SET ${setQueryParts.join(", ")}
          WHERE [ItemNum] = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type for each column
      if (key === "WebPrice" || key === "Weight") {
        request.input(key, sql.Float, itemData[key]);
      } else if (
        key === "ProductOnPromotionPreOrder" ||
        key === "ProductOnSpecialOffer" ||
        key === "NewProduct" ||
        key === "Discountable" ||
        key === "NoWebSales" ||
        key === "IsPrimaryMatrixItem"
      ) {
        request.input(key, sql.Bit, itemData[key]);
      } else if (key === "ReleaseDate") {
        request.input(key, sql.DateTime, itemData[key]);
      } else if (key === "Priority" || key === "Rating") {
        request.input(key, sql.TinyInt, itemData[key]);
      } else if (
        key === "CustomNumber1" ||
        key === "CustomNumber2" ||
        key === "CustomNumber3" ||
        key === "CustomNumber4" ||
        key === "CustomNumber5"
      ) {
        request.input(key, sql.SmallInt, itemData[key]);
      } else if (
        key === "Store_ID" ||
        key === "ItemNum" ||
        key === "ExtendedDescription" ||
        key === "Keywords" ||
        key === "Brand" ||
        key === "Theme" ||
        key === "SubCategory" ||
        key === "LeadTime" ||
        key === "SubDescription1" ||
        key === "SubDescription2" ||
        key === "SubDescription3" ||
        key === "CustomText1" ||
        key === "CustomText2" ||
        key === "CustomText3" ||
        key === "CustomText4" ||
        key === "CustomText5"
      ) {
        request.input(key, sql.NVarChar, itemData[key]);
      } else if (
        key === "CustomExtendedText1" ||
        key === "CustomExtendedText2"
      ) {
        request.input(key, sql.NVarChar, itemData[key]);
      }
      // Add more types as necessary
      else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating Inventory_AdditionalInfo");
  }
}

async function UpdateInventoryAdjust(itemData) {
  console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    for (let key in itemData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Inventory_In]
          SET ${setQueryParts.join(", ")}
          WHERE ItemNum = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      request.input(key, sql.NVarChar, itemData[key]);
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    // console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating item");
  }
}

async function UpdateInventoryVendors(vendorData) {
  // console.log(vendorData);

  try {
    let pool = await sql.connect(config);

    // Dynamically build the SET part of the query
    let setQueryParts = [];
    for (let key in vendorData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    // Build the UPDATE query with dynamic SET
    let updateQuery = `
          UPDATE [dbo].[Inventory_Vendors]
          SET ${setQueryParts.join(", ")}
          WHERE ItemNum = @ItemNum AND Store_ID = @Store_ID;
      `;

    let request = pool.request();

    // Add inputs dynamically based on vendorData
    for (let key in vendorData) {
      // Determine the appropriate SQL type based on the key
      let sqlType;
      switch (key) {
        case "ItemNum":
        case "Store_ID":
        case "Vendor_Part_Num":
          sqlType = sql.NVarChar; // String fields
          break;
        case "Vendor_Number":
          sqlType = sql.NVarChar; // Vendor Number is also string
          break;
        case "CostPer":
        case "Case_Cost":
        case "CubeCost":
        case "WeightCost":
        case "LandedCost":
          sqlType = sql.Money; // Money fields
          break;
        case "NumPerVenCase":
          sqlType = sql.Float; // Float fields
          break;
        case "OverrideCommission":
          sqlType = sql.Bit; // Boolean fields
          break;
        default:
          sqlType = sql.NVarChar; // Default to string if unsure
      }
      request.input(key, sqlType, vendorData[key]);
    }

    // Execute the query
    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating vendor");
  }
}

async function addOrder(order) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool
      .request()
      .input("Id", sql.Int, order.Id)
      .input("Title", sql.NVarChar, order.Title)
      .input("Quantity", sql.Int, order.Quantity)
      .input("Message", sql.NVarChar, order.Message)
      .input("City", sql.NVarChar, order.City)
      .execute("InsertOrders");
    return insertProduct.recordsets;
  } catch (err) {
    console.log(err);
  }
}

async function getDepartments(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query("SELECT Dept_ID, Description FROM Departments");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getKidIndexList(Kit_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Kit_ID", sql.NVarChar, Kit_ID)
      .query("SELECT * FROM Kit_Index where Kit_ID = @Kit_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getViewAltSKU(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query("SELECT * FROM Inventory_SKUS WHERE ItemNum = @ItemNum");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUnitAltSKU(ItemNum, AltSKU) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("AltSKU", sql.NVarChar, AltSKU)
      .query(
        "SELECT * FROM Inventory_SKUS WHERE ItemNum = @ItemNum AND AltSKU = @AltSKU"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInvoiceOnHold() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT IT.[Invoice_Number], IT.[Store_ID], IT.[CustNum], IT.[DateTime], IT.[Total_Cost], IT.[Discount], IT.[Total_Price], IT.[Total_Tax1], IT.[Total_Tax2], IT.[Total_Tax3], IT.[Grand_Total], IT.[Amt_Tendered], IT.[Amt_Change], IT.[ShipToUsed], IT.[InvoiceNotesUsed], IT.[Status], IT.[Cashier_ID], IT.[Station_ID], IT.[Payment_Method], IT.[Acct_Balance_Due], IT.[Acct_FullyPaid_Date], IT.[Taxed_1], IT.[Taxed_Sales], IT.[NonTaxed_Sales], IT.[Tax_Exempt_Sales], IT.[CA_Amount], IT.[CH_Amount], IT.[CC_Amount], IT.[OA_Amount], IT.[GC_Amount], IT.[Tip_Amount], IT.[Old_Balance], IT.[Num_People_Party], IT.[AcctBalanceBefore], IT.[Salesperson], IT.[Dirty], IT.[Zip_Code], IT.[InvType], IT.[FS_Amount], IT.[Amt_FS_AmtTend], IT.[Amt_FS_Change], IT.[DC_Amount], IT.[OA_Amount_Limited], IT.[Cost_Center_Index], IT.[Orig_OnHoldID], IT.[Total_FixedTax], IT.[Total_GC_Sold], IT.[Tax_Rate_ID], IT.[Tax_Rate1_Percent], IT.[Amt_CA_Sec], IT.[Exchange_Rate], IT.[IsLayaway], IT.[Amt_Deposit], IT.[LAY_Amount], IT.[Total_GC_Free], IT.[MacromatixSyncStatus], IT.[TotalLiability], IT.[ReferenceInvoiceNumber], IT.[CourseOrderingProgress], IT.[Amt_CA_Sec_Tendered], IT.[OnlineOrderID], IT.[OrderSource], IT.[OP_Amount], IT.[MP_Amount], IT.[TaxCategory], IT.[MPDiscount_Amount], IT.[Donation_Amount], IT.[Total_UndiscountedSale], IT.[EBTCashBenefit_Amount], IT.[Split_Check_Type], IT.[OnlineLoyalty_Contact_ID], IT.[Total_Tax4], IT.[Total_Tax5], IT.[Total_Tax6], IT.[AgeVerificationMethod], IT.[AgeVerification], IT.[CP_Amount], IH.OnHoldID FROM Invoice_Totals AS IT LEFT JOIN Invoice_OnHold AS IH ON IT.Invoice_Number = IH.Invoice_Number WHERE IT.Status = 'O'"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventoryAdditional(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query("SELECT * FROM Inventory_AdditionalInfo where ItemNum = @ItemNum");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventoryFilter() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT TOP 100 i.*, iai.Brand, iai.SubCategory FROM Inventory i LEFT JOIN Inventory_AdditionalInfo iai ON i.ItemNum = iai.ItemNum WHERE i.IsDeleted = 0"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventoryFilter_BrandOrCategory() {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request().query(`SELECT 
  CASE 
      WHEN ROW_NUMBER() OVER (PARTITION BY Brand ORDER BY SubCategory) = 1 THEN Brand 
      ELSE NULL 
  END AS Brand,
  SubCategory
FROM Inventory_AdditionalInfo
WHERE Brand IS NOT NULL AND Brand <> ''
AND SubCategory IS NOT NULL AND SubCategory <> ''
ORDER BY Brand, SubCategory;`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInvoiceOnHoldItems(Invoice_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Invoice_Number", sql.NVarChar, Invoice_Number)
      .query(
        "SELECT * FROM Invoice_Itemized WHERE Invoice_Number = @Invoice_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInvoice(Invoice_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Invoice_Number", sql.NVarChar, Invoice_Number)
      .query(
        "SELECT * FROM Invoice_OnHold WHERE Invoice_Number = @Invoice_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getInventory_KidIndex(Kit_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Kit_ID", sql.NVarChar, Kit_ID)
      .query(
        "SELECT i.* FROM Inventory i WHERE i.ItemNum IN (SELECT ki.ItemNum FROM Kit_Index ki WHERE ki.Kit_ID = @Kit_ID) AND i.IsDeleted = 0"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

//KidIndex
async function DeleteKidIndex(Kit_ID, ItemNum) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("Kit_ID", sql.NVarChar, Kit_ID)
      .query(
        "DELETE FROM Kit_Index WHERE Kit_ID = @Kit_ID AND ItemNum = @ItemNum"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeleteOnHold(Invoice_Number) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Invoice_Number", sql.NVarChar, Invoice_Number)
      .query(
        "DELETE FROM Invoice_OnHold WHERE Invoice_Number = @Invoice_Number"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeleteAltSKUS(ItemNum, AltSKU) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("AltSKU", sql.NVarChar, AltSKU)
      .query(
        "DELETE FROM Inventory_SKUS WHERE ItemNum = @ItemNum AND AltSKU = @AltSKU"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeletePoItems(PO_Number, ItemNum) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("PO_Number", sql.NVarChar, PO_Number)
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "DELETE From PO_Details Where PO_Number = @PO_Number AND ItemNum = @ItemNum"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeleteTagAlong(ItemNum, TagAlong_ItemNum) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("TagAlong_ItemNum", sql.NVarChar, TagAlong_ItemNum)
      .query(
        "DELETE FROM Inventory_TagAlongs WHERE ItemNum = @ItemNum AND TagAlong_ItemNum = @TagAlong_ItemNum"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeleteOnHoldItems(Invoice_Number, ItemNum) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("Invoice_Number", sql.Numeric, Invoice_Number)
      .query(
        "DELETE FROM Invoice_Itemized where Invoice_Number = @Invoice_Number AND ItemNum = @ItemNum"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function get_Itemized_LineNum(Invoice_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Invoice_Number", sql.NVarChar, Invoice_Number)
      .query(
        "SELECT COALESCE(MAX(LineNum + 1), 1) AS MaxValue FROM Invoice_Itemized where Invoice_Number = @Invoice_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Total_Lottery_Sales() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT II.* FROM Invoice_Itemized as II LEFT JOIN Inventory AS I ON II.ItemNum = I.ItemNum WHERE I.Dept_ID = 'LOTTO'"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_ReorderLevel_Count() {
  try {
    const query = ` SELECT 
  COUNT(DISTINCT i.ItemNum) AS MaxValue
FROM 
  Inventory i
INNER JOIN 
  PO_Details pd ON i.ItemNum = pd.ItemNum
INNER JOIN 
  PO_Summary ps ON pd.PO_Number = ps.PO_Number
WHERE 
  i.In_Stock > 0 AND i.In_Stock <= i.Reorder_Level
  AND (
      (pd.ItemNum IS NOT NULL AND ps.Status = 'O')  
      OR pd.ItemNum IS NULL
  );`;

    let pool = await sql.connect(config);
    let product = await pool.request().query(query);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_LowStockLevel_Count() {
  try {
    const query = `SELECT 
  COUNT(DISTINCT i.ItemNum) AS MaxValue
FROM 
  Inventory i
INNER JOIN 
  PO_Details pd ON i.ItemNum = pd.ItemNum
INNER JOIN 
  PO_Summary ps ON pd.PO_Number = ps.PO_Number
WHERE 
  i.In_Stock <= 0
  AND (
      (pd.ItemNum IS NOT NULL AND ps.Status = 'O')  
      OR pd.ItemNum IS NULL
  );`;

    let pool = await sql.connect(config);
    let product = await pool.request().query(query);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_PO_LineNum(PO_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("PO_Number", sql.NVarChar, PO_Number)
      .query(
        "SELECT COALESCE(MAX(LineNum + 1), 1) AS MaxValue FROM PO_Details where PO_Number = @PO_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateCountItems(ItemData) {
  try {
    let pool = await sql.connect(config);

    // Step 1: Reset all stocks to 0
    const resetQuery = `
          UPDATE [dbo].[Inventory]
          SET In_Stock = 0;
      `;
    await pool.request().query(resetQuery);

    // Step 2: Update stocks for items provided in itemsData
    for (let item of ItemData) {
      const updateQuery = `
              UPDATE [dbo].[Inventory]
              SET In_Stock = @In_Stock
              WHERE ItemNum = @ItemNum;
          `;

      let request = pool.request();
      request.input("In_Stock", sql.Int, parseInt(item.value) || 0); // Value from frontend or 0
      request.input("ItemNum", sql.NVarChar, item.itemNum);

      const result = await request.query(updateQuery);
      // console.log("Updated ItemNum: ${item.itemNum}, Result:", result);
    }

    return { message: "Stocks updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating inventory stocks");
  }
}

async function createInvoiceOnHold(itemData) {
  try {
    let pool = await sql.connect(config);

    let insertQuery = `
          INSERT INTO [dbo].[Invoice_OnHold] (
            Invoice_Number, OnHoldID, Cashier_ID, Store_ID, Occupied, Section_ID, 
              Status, Identifier, PreAuthorized, Name, Station_ID
          ) VALUES (
              @Invoice_Number, @OnHoldID, @Cashier_ID, @Store_ID, @Occupied, @Section_ID, 
              @Status, @Identifier, @PreAuthorized, @Name, @Station_ID
          );
      `;

    let request = pool.request();

    // Loop through the itemData and add it as input parameters
    for (let key in itemData) {
      if (itemData.hasOwnProperty(key)) {
        // Dynamically assign types based on the key if necessary
        if (key === "Invoice_Number") {
          request.input(key, sql.BigInt, itemData[key]);
        } else if (key === "Occupied" || key === "PreAuthorized") {
          request.input(key, sql.Bit, itemData[key]);
        } else if (key === "Status") {
          request.input(key, sql.Int, itemData[key]);
        } else {
          request.input(key, sql.NVarChar, itemData[key]);
        }
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function createInvoiceItemized(itemData) {
  try {
    // console.log("Item Data:", itemData);

    // Step 1: Get the next LineNum for the given Invoice_Number
    const lineNumResult = await get_Itemized_LineNum(itemData.Invoice_Number);

    // Log the result from get_Itemized_LineNum to check if it's correct
    // console.log("LineNum Result:", lineNumResult);

    // Ensure we have a valid LineNum value
    const nextLineNum = lineNumResult[0][0]
      ? lineNumResult[0][0].MaxValue
      : null;

    // If nextLineNum is null, throw an error or handle the case where no value is returned
    if (!nextLineNum) {
      throw new Error(
        "Could not retrieve next LineNum for Invoice_Number: " +
          itemData.Invoice_Number
      );
    }

    // Step 2: Add the LineNum to the itemData
    itemData.LineNum = nextLineNum;
    // console.log("Assigned LineNum:", itemData.LineNum);

    // Step 3: Now insert the data with the correct LineNum
    let pool = await sql.connect(config);

    let insertQuery = `
          INSERT INTO [dbo].[Invoice_Itemized] (
              Invoice_Number, LineNum, ItemNum, Quantity, CostPer, PricePer, Tax1Per, Tax2Per, Tax3Per, Serial_Num, 
              Kit_ItemNum, BC_Invoice_Number, LineDisc, DiffItemName, NumScans, numBonus, Line_Tax_Exempt, 
              Commission, Store_ID, origPricePer, Allow_Discounts, Person, Sale_Type, Ticket_Number, IsRental, 
              FixedTaxPer, GC_Sold, Special_Price_Lock, As_Is, Returned, DOB, UserDefined, Cashier_ID_Itemized, 
              IsLayaway, ReturnedQuantity, GC_Free, ScaleItemType, ParentObjectID, BulkRate, 
              SecurityDeposit, Liability, SalePricePer, Line_Tax_Exempt_2, Line_Tax_Exempt_3, modifierPriceLock, 
              Salesperson, ComboApplied, KitchenQuantityPrinted, PricePerBeforeDiscount, OrigPriceSetBy, 
              PriceChangedBy, Kit_Override, KitTotal, SentToKitchen, OnlineLoyalty_OfferId, Tax4Per, Tax5Per, 
              Tax6Per, Line_Tax_Exempt_4, Line_Tax_Exempt_5, Line_Tax_Exempt_6, Tare
          ) VALUES (
              @Invoice_Number, @LineNum, @ItemNum, @Quantity, @CostPer, @PricePer, @Tax1Per, @Tax2Per, @Tax3Per, 
              @Serial_Num, @Kit_ItemNum, @BC_Invoice_Number, @LineDisc, @DiffItemName, @NumScans, @numBonus, 
              @Line_Tax_Exempt, @Commission, @Store_ID, @origPricePer, @Allow_Discounts, @Person, @Sale_Type, 
              @Ticket_Number, @IsRental, @FixedTaxPer, @GC_Sold, @Special_Price_Lock, @As_Is, @Returned, @DOB, 
              @UserDefined, @Cashier_ID_Itemized, @IsLayaway, @ReturnedQuantity, @GC_Free, @ScaleItemType, 
              @ParentObjectID, @BulkRate, @SecurityDeposit, @Liability, @SalePricePer, 
              @Line_Tax_Exempt_2, @Line_Tax_Exempt_3, @modifierPriceLock, @Salesperson, @ComboApplied, 
              @KitchenQuantityPrinted, @PricePerBeforeDiscount, @OrigPriceSetBy, @PriceChangedBy, @Kit_Override, 
              @KitTotal, @SentToKitchen, @OnlineLoyalty_OfferId, @Tax4Per, @Tax5Per, 
              @Tax6Per, @Line_Tax_Exempt_4, @Line_Tax_Exempt_5, @Line_Tax_Exempt_6, @Tare
          );
      `;

    let request = pool.request();

    // Step 4: Loop through the itemData and add it as input parameters
    for (let key in itemData) {
      if (itemData.hasOwnProperty(key)) {
        // Dynamically assign types based on the key if necessary
        if (key === "Invoice_Number") {
          request.input(key, sql.BigInt, itemData[key]);
        } else if (
          key === "LineNum" ||
          key === "NumScans" ||
          key === "numBonus" ||
          key === "Sale_Type" ||
          key === "BC_Invoice_Number"
        ) {
          request.input(key, sql.Int, itemData[key]);
        } else if (
          key === "Quantity" ||
          key === "CostPer" ||
          key === "PricePer" ||
          key === "Tax1Per" ||
          key === "Tax2Per" ||
          key === "Tax3Per" ||
          key === "LineDisc" ||
          key === "Commission" ||
          key === "origPricePer" ||
          key === "FixedTaxPer" ||
          key === "GC_Sold" ||
          key === "SalePricePer" ||
          key === "PricePerBeforeDiscount" ||
          key === "KitchenQuantityPrinted" ||
          key === "PriceChangedBy" ||
          key === "KitTotal" ||
          key === "Kit_Override" ||
          key === "GC_Free" ||
          key === "Liability" ||
          key === "SecurityDeposit" ||
          key === "Tare"
        ) {
          request.input(key, sql.Decimal(25, 8), itemData[key]);
        } else if (
          key === "IsRental" ||
          key === "Line_Tax_Exempt" ||
          key === "Allow_Discounts" ||
          key === "IsLayaway" ||
          key === "Special_Price_Lock" ||
          key === "As_Is" ||
          key === "Returned" ||
          key === "Line_Tax_Exempt_2" ||
          key === "Line_Tax_Exempt_3" ||
          key === "modifierPriceLock" ||
          key === "ComboApplied" ||
          key === "SentToKitchen" ||
          key === "Line_Tax_Exempt_4" ||
          key === "Line_Tax_Exempt_5" ||
          key === "Line_Tax_Exempt_6"
        ) {
          request.input(key, sql.Bit, itemData[key]);
        } else if (
          key === "DOB" ||
          key === "GC_Sold" ||
          key === "SalePricePer" ||
          key === "KitTotal" ||
          key === "Tare"
        ) {
          request.input(key, sql.Money, itemData[key]);
        } else {
          request.input(key, sql.NVarChar, itemData[key]);
        }
      }
    }

    // Step 5: Execute the query
    const response = await request.query(insertQuery);
    console.log("Insert Response:", response);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function createPODetail(itemData) {
  try {
    const lineNumResult = await get_PO_LineNum(itemData.PO_Number);
    const nextLineNum = lineNumResult[0][0]
      ? lineNumResult[0][0].MaxValue
      : null;

    if (!nextLineNum) {
      throw new Error(
        "Could not retrieve next LineNum for PO_Number: " + itemData.PO_Number
      );
    }

    itemData.LineNum = nextLineNum;

    let pool = await sql.connect(config);

    let insertQuery = `
          INSERT INTO [dbo].[PO_Details] (
              PO_Number, ItemNum, LineNum, Quan_Ordered, CostPer, Quan_Received, Vendor_Part_Number, CasePack, 
              Store_ID, destStore_ID, Current_Batch_Quan, Quan_Damaged, Reason, NumberPerCase, OverrideCommission, Quan_OutofDate
          ) VALUES (
              @PO_Number, @ItemNum, @LineNum, @Quan_Ordered, @CostPer, @Quan_Received, @Vendor_Part_Number, @CasePack, 
              @Store_ID, @destStore_ID, @Current_Batch_Quan, @Quan_Damaged, @Reason, @NumberPerCase, @OverrideCommission, @Quan_OutofDate
          );
      `;

    let request = pool.request();

    // Step 4: Loop through the itemData and add it as input parameters
    for (let key in itemData) {
      if (itemData.hasOwnProperty(key)) {
        // Dynamically assign types based on the key
        if (key === "PO_Number") {
          request.input(key, sql.BigInt, itemData[key]);
        } else if (
          key === "LineNum" ||
          key === "Quan_Ordered" ||
          key === "Quan_Received" ||
          key === "Quan_Damaged" ||
          key === "Current_Batch_Quan"
        ) {
          request.input(key, sql.Float, itemData[key]);
        } else if (key === "CostPer") {
          request.input(key, sql.Money, itemData[key]);
        } else if (
          key === "CasePack" ||
          key === "NumberPerCase" ||
          key === "Quan_OutofDate"
        ) {
          request.input(key, sql.Float, itemData[key]);
        } else if (key === "OverrideCommission" || key === "Quan_OutofDate") {
          request.input(key, sql.Bit, itemData[key]);
        } else {
          request.input(key, sql.NVarChar, itemData[key]);
        }
      }
    }

    // Step 5: Execute the query
    const response = await request.query(insertQuery);
    console.log("Insert Response:", response);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function get_PO_Number() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT COALESCE(MAX(PO_Number + 1), 1) AS MaxValue FROM PO_Summary"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Vender_Details(Vendor_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Vendor_Number", sql.NVarChar, Vendor_Number)
      .query("SELECT * FROM Vendors WHERE Vendor_Number = @Vendor_Number");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Tag_Along_Items(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool.request().input("ItemNum", sql.NVarChar, ItemNum)
      .query(`SELECT IT.*, I.ItemName, I.Dept_ID, I.Vendor_Number, IA.Brand, IA.SubCategory FROM Inventory_TagAlongs AS IT 
          LEFT JOIN Inventory AS I ON IT.ItemNum = I.ItemNum
          LEFT JOIN Inventory_AdditionalInfo AS IA ON IT.ItemNum = IA.ItemNum
          WHERE IT.ItemNum = @ItemNum`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function Check_Exists_Tag_Along_Items(ItemNum, TagAlong_ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("TagAlong_ItemNum", sql.NVarChar, TagAlong_ItemNum)
      .query(
        `SELECT * FROM Inventory_TagAlongs WHERE ItemNum = @ItemNum AND TagAlong_ItemNum = @TagAlong_ItemNum `
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function createPOSummary(itemData) {
  // console.log(itemData);

  try {
    // const lineNumResult = await get_PO_Number();
    // const nextLineNum = lineNumResult[0][0] ? lineNumResult[0][0].MaxValue : null;

    const vedordetails = await get_Vender_Details(itemData.Vendor_Number);
    const nextvendor = vedordetails[0][0];

    if (!nextvendor) {
      throw new Error(
        "Could not retrieve next LineNum for PO_Number: " + itemData.PO_Number
      );
    }

    itemData.Terms = nextvendor.Vendor_Terms;

    let pool = await sql.connect(config);

    let insertQuery = `
          INSERT INTO [dbo].[PO_Summary] (
              PO_Number, Store_ID, DateTime, Reference, Vendor_Number, Total_Cost, Total_Cost_Received, Terms, Due_Date, Ship_Via, 
              ShipTo_1, ShipTo_2, ShipTo_3, ShipTo_4, ShipTo_5, Instructions, Status, Last_Modified, Dirty, Cashier_ID, 
              Billable_Department, ShipTo_Destination, Ordering_Mode, Fully_Authorized, Print_Notes_On_PO, Cancel_Date, 
              Total_Charges, Fully_Paid, POType, ExpectedAmountToReceive, Order_Reason, Distributor
          ) VALUES (
              @PO_Number, @Store_ID, @DateTime, @Reference, @Vendor_Number, @Total_Cost, @Total_Cost_Received, @Terms, @Due_Date, @Ship_Via, 
              @ShipTo_1, @ShipTo_2, @ShipTo_3, @ShipTo_4, @ShipTo_5, @Instructions, @Status, @Last_Modified, @Dirty, @Cashier_ID, 
              @Billable_Department, @ShipTo_Destination, @Ordering_Mode, @Fully_Authorized, @Print_Notes_On_PO, @Cancel_Date, 
              @Total_Charges, @Fully_Paid, @POType, @ExpectedAmountToReceive, @Order_Reason, @Distributor
          );
      `;

    let request = pool.request();

    // Step 4: Loop through the itemData and add it as input parameters
    for (let key in itemData) {
      if (itemData.hasOwnProperty(key)) {
        // Dynamically assign types based on the key
        if (key === "PO_Number") {
          request.input(key, sql.BigInt, itemData[key]);
        } else if (
          key === "Total_Cost" ||
          key === "Total_Cost_Received" ||
          key === "Total_Charges"
        ) {
          request.input(key, sql.Money, itemData[key]);
        } else if (
          key === "DateTime" ||
          key === "Due_Date" ||
          key === "Last_Modified" ||
          key === "Cancel_Date"
        ) {
          request.input(key, sql.DateTime, itemData[key]);
        } else if (
          key === "Ordering_Mode" ||
          key === "POType" ||
          key === "ExpectedAmountToReceive"
        ) {
          request.input(key, sql.Int, itemData[key]);
        } else if (
          key === "Fully_Authorized" ||
          key === "Print_Notes_On_PO" ||
          key === "Fully_Paid" ||
          key === "Dirty"
        ) {
          request.input(key, sql.Bit, itemData[key]);
        } else if (
          key === "Ship_Via" ||
          key === "Terms" ||
          key === "Reference" ||
          key === "Vendor_Number" ||
          key === "ShipTo_1" ||
          key === "ShipTo_2" ||
          key === "ShipTo_3" ||
          key === "ShipTo_4" ||
          key === "ShipTo_5" ||
          key === "Instructions" ||
          key === "Status" ||
          key === "Cashier_ID" ||
          key === "Billable_Department" ||
          key === "ShipTo_Destination" ||
          key === "Order_Reason" ||
          key === "Distributor"
        ) {
          request.input(key, sql.NVarChar, itemData[key]);
        } else if (key === "Store_ID") {
          request.input(key, sql.NVarChar(10), itemData[key]);
        } else if (key === "Ordering_Mode") {
          request.input(key, sql.SmallInt, itemData[key]);
        }
      }
    }

    // Step 5: Execute the query
    const response = await request.query(insertQuery);
    console.log("Insert Response:", response);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function get_Invoice_Totals(Invoice_Number) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Invoice_Number", sql.NVarChar, Invoice_Number)
      .query(
        "SELECT IT.[Invoice_Number], IT.[Store_ID], IT.[CustNum], IT.[DateTime], IT.[Total_Cost], IT.[Discount], IT.[Total_Price], IT.[Total_Tax1], IT.[Total_Tax2], IT.[Total_Tax3], IT.[Grand_Total], IT.[Amt_Tendered], IT.[Amt_Change], IT.[ShipToUsed], IT.[InvoiceNotesUsed], IT.[Status], IT.[Cashier_ID], IT.[Station_ID], IT.[Payment_Method], IT.[Acct_Balance_Due], IT.[Acct_FullyPaid_Date], IT.[Taxed_1], IT.[Taxed_Sales], IT.[NonTaxed_Sales], IT.[Tax_Exempt_Sales], IT.[CA_Amount], IT.[CH_Amount], IT.[CC_Amount], IT.[OA_Amount], IT.[GC_Amount], IT.[Tip_Amount], IT.[Old_Balance], IT.[Num_People_Party], IT.[AcctBalanceBefore], IT.[Salesperson], IT.[Dirty], IT.[Zip_Code], IT.[InvType], IT.[FS_Amount], IT.[Amt_FS_AmtTend], IT.[Amt_FS_Change], IT.[DC_Amount], IT.[OA_Amount_Limited], IT.[Cost_Center_Index], IT.[Orig_OnHoldID], IT.[Total_FixedTax], IT.[Total_GC_Sold], IT.[Tax_Rate_ID], IT.[Tax_Rate1_Percent], IT.[Amt_CA_Sec], IT.[Exchange_Rate], IT.[IsLayaway], IT.[Amt_Deposit], IT.[LAY_Amount], IT.[Total_GC_Free], IT.[MacromatixSyncStatus], IT.[TotalLiability], IT.[ReferenceInvoiceNumber], IT.[CourseOrderingProgress], IT.[Amt_CA_Sec_Tendered], IT.[OnlineOrderID], IT.[OrderSource], IT.[OP_Amount], IT.[MP_Amount], IT.[TaxCategory], IT.[MPDiscount_Amount], IT.[Donation_Amount], IT.[Total_UndiscountedSale], IT.[EBTCashBenefit_Amount], IT.[Split_Check_Type], IT.[OnlineLoyalty_Contact_ID], IT.[Total_Tax4], IT.[Total_Tax5], IT.[Total_Tax6], IT.[AgeVerificationMethod], IT.[AgeVerification], IT.[CP_Amount], IH.OnHoldID FROM Invoice_Totals AS IT LEFT JOIN Invoice_OnHold AS IH ON IT.Invoice_Number = IH.Invoice_Number WHERE IT.Invoice_Number = @Invoice_Number"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Invoice_Totals_Exists(Orig_OnHoldID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Orig_OnHoldID", sql.NVarChar, Orig_OnHoldID)
      .query(
        "SELECT Orig_OnHoldID, Status FROM Invoice_Totals WHERE Orig_OnHoldID = @Orig_OnHoldID AND Status = 'O'"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function createInvoiceTotals(invoiceData) {
  try {
    // Establish connection with the database
    let pool = await sql.connect(config);

    // The INSERT query for [dbo].[Invoice_Totals]
    let insertQuery = `
          INSERT INTO [dbo].[Invoice_Totals] (
              Invoice_Number, Store_ID, CustNum, DateTime, Total_Cost, Discount, Total_Price, Total_Tax1, Total_Tax2, 
              Total_Tax3, Grand_Total, Amt_Tendered, Amt_Change, ShipToUsed, InvoiceNotesUsed, Status, Cashier_ID, 
              Station_ID, Payment_Method, Acct_Balance_Due, Acct_FullyPaid_Date, Taxed_1, Taxed_Sales, NonTaxed_Sales, 
              Tax_Exempt_Sales, CA_Amount, CH_Amount, CC_Amount, OA_Amount, GC_Amount, Tip_Amount, Old_Balance, 
              Num_People_Party, AcctBalanceBefore, Salesperson, Dirty, Zip_Code, InvType, FS_Amount, Amt_FS_AmtTend, 
              Amt_FS_Change, DC_Amount, OA_Amount_Limited, Cost_Center_Index, Orig_OnHoldID, Total_FixedTax, 
              Total_GC_Sold, Tax_Rate_ID, Tax_Rate1_Percent, Amt_CA_Sec, Exchange_Rate, IsLayaway, Amt_Deposit, 
              LAY_Amount, Total_GC_Free, MacromatixSyncStatus, TotalLiability, ReferenceInvoiceNumber, 
              CourseOrderingProgress, Amt_CA_Sec_Tendered, OnlineOrderID, OrderSource, OP_Amount, MP_Amount, 
              TaxCategory, MPDiscount_Amount, Donation_Amount, Total_UndiscountedSale, EBTCashBenefit_Amount, 
              Split_Check_Type, OnlineLoyalty_Contact_ID, Total_Tax4, Total_Tax5, Total_Tax6, AgeVerificationMethod, 
              AgeVerification, CP_Amount
          ) VALUES (
              @Invoice_Number, @Store_ID, @CustNum, @DateTime, @Total_Cost, @Discount, @Total_Price, @Total_Tax1, 
              @Total_Tax2, @Total_Tax3, @Grand_Total, @Amt_Tendered, @Amt_Change, @ShipToUsed, @InvoiceNotesUsed, 
              @Status, @Cashier_ID, @Station_ID, @Payment_Method, @Acct_Balance_Due, @Acct_FullyPaid_Date, 
              @Taxed_1, @Taxed_Sales, @NonTaxed_Sales, @Tax_Exempt_Sales, @CA_Amount, @CH_Amount, @CC_Amount, 
              @OA_Amount, @GC_Amount, @Tip_Amount, @Old_Balance, @Num_People_Party, @AcctBalanceBefore, @Salesperson, 
              @Dirty, @Zip_Code, @InvType, @FS_Amount, @Amt_FS_AmtTend, @Amt_FS_Change, @DC_Amount, @OA_Amount_Limited, 
              @Cost_Center_Index, @Orig_OnHoldID, @Total_FixedTax, @Total_GC_Sold, @Tax_Rate_ID, @Tax_Rate1_Percent, 
              @Amt_CA_Sec, @Exchange_Rate, @IsLayaway, @Amt_Deposit, @LAY_Amount, @Total_GC_Free, @MacromatixSyncStatus, 
              @TotalLiability, @ReferenceInvoiceNumber, @CourseOrderingProgress, @Amt_CA_Sec_Tendered, @OnlineOrderID, 
              @OrderSource, @OP_Amount, @MP_Amount, @TaxCategory, @MPDiscount_Amount, @Donation_Amount, 
              @Total_UndiscountedSale, @EBTCashBenefit_Amount, @Split_Check_Type, @OnlineLoyalty_Contact_ID, 
              @Total_Tax4, @Total_Tax5, @Total_Tax6, @AgeVerificationMethod, @AgeVerification, @CP_Amount
          );
      `;

    let request = pool.request();

    // Dynamically add input parameters based on invoiceData object
    for (let key in invoiceData) {
      if (invoiceData.hasOwnProperty(key)) {
        switch (key) {
          case "Invoice_Number":
            request.input(key, sql.BigInt, invoiceData[key]);
            break;
          case "Store_ID":
          case "CustNum":
          case "Status":
          case "Cashier_ID":
          case "Station_ID":
          case "Payment_Method":
          case "Salesperson":
          case "Zip_Code":
          case "InvType":
          case "Orig_OnHoldID":
          case "OnlineOrderID":
          case "CourseOrderingProgress":
          case "OnlineLoyalty_Contact_ID":
          case "ReferenceInvoiceNumber":
            request.input(key, sql.NVarChar, invoiceData[key]);
            break;
          case "DateTime":
          case "Acct_FullyPaid_Date":
            request.input(key, sql.DateTime, invoiceData[key]);
            break;
          case "Total_Cost":
          case "Total_Price":
          case "Total_Tax1":
          case "Total_Tax2":
          case "Total_Tax3":
          case "Grand_Total":
          case "Amt_Tendered":
          case "Amt_Change":
          case "Acct_Balance_Due":
          case "Taxed_Sales":
          case "NonTaxed_Sales":
          case "Tax_Exempt_Sales":
          case "CA_Amount":
          case "CH_Amount":
          case "CC_Amount":
          case "OA_Amount":
          case "GC_Amount":
          case "Tip_Amount":
          case "Old_Balance":
          case "AcctBalanceBefore":
          case "FS_Amount":
          case "Amt_FS_AmtTend":
          case "Amt_FS_Change":
          case "DC_Amount":
          case "OA_Amount_Limited":
          case "Total_FixedTax":
          case "Total_GC_Sold":
          case "Amt_CA_Sec":
          case "Amt_Deposit":
          case "LAY_Amount":
          case "Total_GC_Free":
          case "MacromatixSyncStatus":
          case "TotalLiability":
          case "Amt_CA_Sec_Tendered":
          case "OP_Amount":
          case "MP_Amount":
          case "MPDiscount_Amount":
          case "Donation_Amount":
          case "EBTCashBenefit_Amount":
          case "Total_Tax4":
          case "Total_Tax5":
          case "Total_Tax6":
          case "CP_Amount":
            request.input(key, sql.Money, invoiceData[key]);
            break;
          case "Dirty":
          case "ShipToUsed":
          case "InvoiceNotesUsed":
          case "IsLayaway":
            request.input(key, sql.Bit, invoiceData[key]);
            break;
          case "Taxed_1":
          case "Num_People_Party":
          case "Tax_Rate_ID":
          case "Tax_Rate1_Percent":
          case "AgeVerificationMethod":
          case "AgeVerification":
          case "Split_Check_Type":
          case "OrderSource":
          case "TaxCategory":
            request.input(key, sql.Int, invoiceData[key]);
            break;
          case "Discount":
            request.input(key, sql.Real, invoiceData[key]);
            break;
          case "Exchange_Rate":
            request.input(key, sql.Real, invoiceData[key]);
            break;
          default:
            request.input(key, sql.NVarChar, invoiceData[key]);
            break;
        }
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.error("Error executing insert:", error);
  }
}

async function UpdatePO_Summary(poData) {
  // console.log(poData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided poData keys
    for (let key in poData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[PO_Summary]
          SET ${setQueryParts.join(", ")}
          WHERE [PO_Number] = @PO_Number;
      `;

    let request = pool.request();

    // Add inputs dynamically based on poData
    for (let key in poData) {
      // Determine the appropriate SQL data type for each column
      // You can adjust the data types based on your table's structure
      if (
        key === "Total_Cost" ||
        key === "Total_Cost_Received" ||
        key === "Total_Charges"
      ) {
        request.input(key, sql.Money, poData[key]);
      } else if (
        key === "DateTime" ||
        key === "Due_Date" ||
        key === "Last_Modified" ||
        key === "Cancel_Date"
      ) {
        request.input(key, sql.DateTime, poData[key]);
      } else if (key === "Order_Reason") {
        request.input(key, sql.NVarChar(30), poData[key]);
      } else if (key === "Ordering_Mode") {
        request.input(key, sql.SmallInt, poData[key]);
      } else if (key === "POType" || key === "ExpectedAmountToReceive") {
        request.input(key, sql.Int, poData[key]);
      } else if (
        key === "Fully_Authorized" ||
        key === "Fully_Paid" ||
        key === "Dirty"
      ) {
        request.input(key, sql.Bit, poData[key]);
      } else if (
        key === "Status" ||
        key === "Ship_Via" ||
        key === "Terms" ||
        key === "ShipTo_1" ||
        key === "ShipTo_2" ||
        key === "ShipTo_3" ||
        key === "ShipTo_4" ||
        key === "ShipTo_5" ||
        key === "Instructions" ||
        key === "ShipTo_Destination" ||
        key === "Distributor" ||
        key === "Billable_Department" ||
        key === "Cashier_ID" ||
        key === "Store_ID" ||
        key === "Reference"
      ) {
        request.input(key, sql.NVarChar, poData[key]);
      } else {
        request.input(key, sql.NVarChar, poData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating PO_Summary");
  }
}

async function Create_Vendor(vendorData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Vendors
    let insertQuery = `
          INSERT INTO [dbo].[Vendors] (
              Vendor_Number, First_Name, Last_Name, Company, Address_1, Address_2, 
              City, State, Zip_Code, Phone, Fax, Vendor_Tax_ID, Vendor_Terms, 
              SSN, Commission, Rent, Dirty, County, Country, Email, Website, 
              Minimum_Order, Default_Ordering_Mode, Default_Billable_Department, Default_PO_Delivery
          ) VALUES (
              @Vendor_Number, @First_Name, @Last_Name, @Company, @Address_1, @Address_2,
              @City, @State, @Zip_Code, @Phone, @Fax, @Vendor_Tax_ID, @Vendor_Terms, 
              @SSN, @Commission, @Rent, @Dirty, @County, @Country, @Email, @Website, 
              @Minimum_Order, @Default_Ordering_Mode, @Default_Billable_Department, @Default_PO_Delivery
          );
      `;

    let request = pool.request();

    // Dynamically bind parameters from vendorData to the SQL query
    for (let key in vendorData) {
      // You can adjust the data type based on the field. Here I assume everything is NVarChar for simplicity.
      request.input(key, sql.NVarChar, vendorData[key]);
    }

    // Execute the query
    const response = await request.query(insertQuery);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function Create_Department_Index(departmentData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for Departments
    let insertQuery = `
          INSERT INTO [dbo].[Departments] (
              Dept_ID, Store_ID, Description, Type, TSDisplay, Cost_MarkUp, Dirty, 
              SubType, Print_Dept_Notes, Dept_Notes, Require_Permission, 
              Require_Serials, BarTaxInclusive, Cost_Calculation_Percentage, 
              Square_Footage, AvailableOnline, IncludeInScaleExport
          ) VALUES (
              @Dept_ID, @Store_ID, @Description, @Type, @TSDisplay, @Cost_MarkUp, @Dirty, 
              @SubType, @Print_Dept_Notes, @Dept_Notes, @Require_Permission, 
              @Require_Serials, @BarTaxInclusive, @Cost_Calculation_Percentage, 
              @Square_Footage, @AvailableOnline, @IncludeInScaleExport
          );
      `;

    let request = pool.request();
    // Iterate over each key in departmentData and bind it to the request input parameters
    for (let key in departmentData) {
      // Use appropriate SQL data type based on the column
      if (
        key === "Dept_ID" ||
        key === "Store_ID" ||
        key === "Description" ||
        key === "SubType"
      ) {
        request.input(key, sql.NVarChar, departmentData[key]);
      } else if (
        key === "Type" ||
        key === "Cost_MarkUp" ||
        key === "Cost_Calculation_Percentage"
      ) {
        request.input(key, sql.Real, departmentData[key]);
      } else if (
        key === "TSDisplay" ||
        key === "Dirty" ||
        key === "Print_Dept_Notes" ||
        key === "Require_Permission" ||
        key === "Require_Serials" ||
        key === "BarTaxInclusive" ||
        key === "AvailableOnline" ||
        key === "IncludeInScaleExport"
      ) {
        request.input(key, sql.Bit, departmentData[key]);
      } else if (key === "Dept_Notes") {
        request.input(key, sql.NText, departmentData[key]);
      } else if (key === "Square_Footage") {
        request.input(key, sql.BigInt, departmentData[key]);
      } else if (key === "RowID") {
        request.input(key, sql.UniqueIdentifier, departmentData[key]);
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function get_Department_Exists(Dept_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Dept_ID", sql.NVarChar, Dept_ID)
      .query("SElECT * FROM Departments WHERE Dept_ID = @Dept_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function UpdateEmployee(employeeData) {
  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    for (let key in employeeData) {
      setQueryParts.push(`${key} = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[Employee]
          SET ${setQueryParts.join(", ")}
          WHERE [Cashier_ID]=@Cashier_ID;
      `;

    let request = pool.request();

    // Add inputs dynamically based on employeeData
    for (let key in employeeData) {
      // Determine the correct SQL type for each field if needed
      if (typeof employeeData[key] === "string") {
        request.input(key, sql.NVarChar, employeeData[key]);
      } else if (typeof employeeData[key] === "number") {
        request.input(key, sql.Money, employeeData[key]); // Adjust types as needed (money, int, etc.)
      } else if (typeof employeeData[key] === "boolean") {
        request.input(key, sql.Bit, employeeData[key]);
      } else if (employeeData[key] instanceof Date) {
        request.input(key, sql.DateTime, employeeData[key]);
      }
    }

    const result = await request.query(updateQuery);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating employee");
  }
}

module.exports = {
  getInventorys: getInventorys,
  get_Department_Exists: get_Department_Exists,
  Create_Department_Index: Create_Department_Index,
  Check_Exists_Tag_Along_Items: Check_Exists_Tag_Along_Items,
  getInventoryFilter_BrandOrCategory: getInventoryFilter_BrandOrCategory,
  getInventory: getInventory,
  getInventoryByDepID: getInventoryByDepID,
  getLotteryInvoiceDetails: getLotteryInvoiceDetails,
  addOrder: addOrder,
  CreacteBarcode: CreacteBarcode,
  getLatestSoldItems: getLatestSoldItems,
  getDepartments: getDepartments,
  UpdateBarcode: UpdateBarcode,
  updateInvoiceTotals: updateInvoiceTotals,
  getReasonCodes: getReasonCodes,
  UpdateInventoryAdjust: UpdateInventoryAdjust,
  CreacteInventory_In: CreacteInventory_In,
  getInventoryNoPg: getInventoryNoPg,
  Create_Setup_TS_Buttons: Create_Setup_TS_Buttons,
  Create_Inventory_Reference: Create_Inventory_Reference,
  Create_Kit_Index: Create_Kit_Index,
  Create_BumpBarSettings: Create_BumpBarSettings,
  Create_Inventory_AdditionalInfo: Create_Inventory_AdditionalInfo,
  get_Inventory_Reference_ID: get_Inventory_Reference_ID,
  get_Setup_TS_Buttons_Index: get_Setup_TS_Buttons_Index,
  Create_Inventory_Entry: Create_Inventory_Entry,
  DeleteKidIndex: DeleteKidIndex,
  getKidIndexList: getKidIndexList,
  getInventory_KidIndex: getInventory_KidIndex,
  UpdateKitIndex: UpdateKitIndex,
  updateCountItems: updateCountItems,
  getViewAltSKU: getViewAltSKU,
  Create_Inventory_SKUS: Create_Inventory_SKUS,
  getInvoiceOnHold: getInvoiceOnHold,
  getInvoiceOnHoldItems: getInvoiceOnHoldItems,
  createInvoiceOnHold: createInvoiceOnHold,
  createInvoiceItemized: createInvoiceItemized,
  createInvoiceTotals: createInvoiceTotals,
  get_Invoice_ID: get_Invoice_ID,
  DeleteOnHoldItems: DeleteOnHoldItems,
  get_Itemized_LineNum: get_Itemized_LineNum,
  UpdateInvoiceItemized: UpdateInvoiceItemized,
  get_Invoice_Totals: get_Invoice_Totals,
  get_Purchase_Orders: get_Purchase_Orders,
  get_Purchase_Orders_Items: get_Purchase_Orders_Items,
  get_Vendor_Items: get_Vendor_Items,
  createPODetail: createPODetail,
  UpdatePODetails: UpdatePODetails,
  DeletePoItems: DeletePoItems,
  getVendors: getVendors,
  createPOSummary: createPOSummary,
  get_PO_Number: get_PO_Number,
  UpdatePO_Summary: UpdatePO_Summary,
  get_Purchase_Orders_Unique: get_Purchase_Orders_Unique,
  get_Vendor_Items_Page: get_Vendor_Items_Page,
  get_Exist_Location: get_Exist_Location,
  get_Empoloyee_Permission: get_Empoloyee_Permission,
  login_Employee: login_Employee,
  Create_Reason_Code: Create_Reason_Code,
  get_Vendor_Items_By_ItemNum: get_Vendor_Items_By_ItemNum,
  get_All_Vendor_Items: get_All_Vendor_Items,
  getAllvendoritems_Pagination: getAllvendoritems_Pagination,
  get_Vender_Details: get_Vender_Details,
  UpdateInventoryVendors: UpdateInventoryVendors,
  create_Inventory_TagAlongs: create_Inventory_TagAlongs,
  get_Tag_Along_Items: get_Tag_Along_Items,
  DeleteTagAlong: DeleteTagAlong,
  UpdateInventoryAdditionalInfo: UpdateInventoryAdditionalInfo,
  getInventoryAdditional: getInventoryAdditional,
  getInventoryFilter: getInventoryFilter,
  get_ReorderLevel_Count: get_ReorderLevel_Count,
  get_LowStockLevel_Count: get_LowStockLevel_Count,
  get_Total_Lottery_Sales: get_Total_Lottery_Sales,
  DeleteAltSKUS: DeleteAltSKUS,
  getUnitAltSKU: getUnitAltSKU,
  Create_Vendor: Create_Vendor,
  DeleteOnHold: DeleteOnHold,
  get_Vendor_Items_Assign: get_Vendor_Items_Assign,
  DeleteReasonCode: DeleteReasonCode,
  get_Vendor_Items_All: get_Vendor_Items_All,
  Create_Inventory_Vendor: Create_Inventory_Vendor,
  getInvoice: getInvoice,
  get_Invoice_Totals_Exists: get_Invoice_Totals_Exists,
  Update_PO_Details: Update_PO_Details,
  get_All_Employee: get_All_Employee,
  get_All_Trans_History: get_All_Trans_History,
  getLotteryTotalValue: getLotteryTotalValue,
  UpdateEmployee: UpdateEmployee,
};
