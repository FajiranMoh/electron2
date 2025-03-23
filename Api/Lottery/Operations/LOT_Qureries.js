var config = require("../Connection/LOT_Dbconfig");
const sql = require("mssql");

async function Create_Lot_Shift_Detail(shiftData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Shift_Details] (
              [Shift_ID], [Shift_Cashier_ID], [Shift_Start_Time], [Shift_End_Time], [Shift_Status]
          ) VALUES (
              @Shift_ID, @Shift_Cashier_ID, @Shift_Start_Time, @Shift_End_Time, @Shift_Status
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the shiftData object and add each key-value pair as an input parameter
    for (let key in shiftData) {
      request.input(key, sql.NVarChar, shiftData[key]); // Adjust the type if needed for different fields
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}

async function Create_Unit_Type(unitTypeData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[INV_Unit_Types] (
              [ID], [Unit_Type]
          ) VALUES (
              @ID, @Unit_Type
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the unitTypeData object and add each key-value pair as an input parameter
    for (let key in unitTypeData) {
      request.input(key, sql.NVarChar, unitTypeData[key]); // Adjust the type if needed for different fields
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}

async function Create_Lot_Game_Detail(gameData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Games_Details] (
              [Game_ID], [Open_Book], [Close_Book], [Stock_Level_Open], [Stock_Level_Close], 
              [Shift_Open_Serial], [Shift_Close_Serial], [Location], [Shift_ID], [Date]
          ) VALUES (
              @Game_ID, @Open_Book, @Close_Book, @Stock_Level_Open, @Stock_Level_Close, 
              @Shift_Open_Serial, @Shift_Close_Serial, @Location, @Shift_ID, @Date
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the gameData object and add each key-value pair as an input parameter
    for (let key in gameData) {
      // Adjust the input type based on the field type (e.g., sql.Int for integers, sql.NVarChar for strings)
      if (key === "Stock_Level_Open" || key === "Stock_Level_Close") {
        request.input(key, sql.Int, gameData[key]);
      } else {
        request.input(key, sql.NVarChar, gameData[key]);
      }
    }

    // Execute the query
    const result = await request.query(insertQuery);

    // Return the result if successful
    return result;
  } catch (error) {
    // If there is an error, throw it so that it can be caught in the .catch block
    throw error;
  }
}

async function Create_Lot_Activate_Book(bookData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Activate_Books] (
             [Game_ID], [Book_No], [Book_Created], [Book_Tickets], [CreatedBy], 
              [Location], [ItemNum]
          ) VALUES (
              @Game_ID, @Book_No, @Book_Created, @Book_Tickets, @CreatedBy, 
              @Location, @ItemNum
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the bookData object and add each key-value pair as an input parameter
    for (let key in bookData) {
      // Adjust the input type based on the field type
      if (key === "Book_Tickets") {
        request.input(key, sql.Int, bookData[key]); // For integers like Book_Tickets
      } else if (key === "Book_Created") {
        request.input(key, sql.DateTime, bookData[key]); // For DateTime fields
      } else {
        request.input(key, sql.NVarChar, bookData[key]); // For string fields like Book_No, CreatedBy, Location, and ItemNum
      }
    }

    // Execute the query
    const result = await request.query(insertQuery);

    // Return the result if successful
    return result;
  } catch (error) {
    // If there is an error, throw it so that it can be caught in the .catch block
    throw error;
  }
}

async function get_Shift_ID() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT COALESCE(MAX(Shift_ID + 1), 1) AS MaxValue FROM LOT_Shift_Details"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Inventory_UnitTypes_ID() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query("SELECT COALESCE(MAX(ID + 1), 1) AS MaxValue FROM INV_Unit_Types");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_All_Shift_Details() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query("SELECT * FROM LOT_Shift_Details ORDER BY Shift_ID DESC");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Game_Details(Shift_ID, Location) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Shift_ID", sql.NVarChar, Shift_ID)
      .input("Location", sql.NVarChar, Location)
      .query(
        "SELECT * FROM LOT_Games_Details WHERE Shift_ID = @Shift_ID AND Location = @Location"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_All_Shift_All_Games_Details(Shift_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Shift_ID", sql.NVarChar, Shift_ID)
      .query("SELECT * FROM LOT_Games_Details WHERE Shift_ID = @Shift_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_All_Games_Details(Shift_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Shift_ID", sql.NVarChar, Shift_ID)
      .query("SELECT * FROM LOT_Games_Details");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Shift_Book_Details(ItemNum, Location) {
  console.log("IteMES", ItemNum, Location);

  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .input("Location", sql.NVarChar, Location)
      .query(
        "SELECT * FROM LOT_Activate_Books WHERE ItemNum = @ItemNum AND Location = @Location"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_all_book_history_detail(ItemNum) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("ItemNum", sql.NVarChar, ItemNum)
      .query(
        "SELECT * FROM LOT_Activated_Book_History WHERE ItemNum = @ItemNum"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_All_Book_Details() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query("SELECT * FROM LOT_Activate_Books");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Shift_Details(Shift_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Shift_ID", sql.NVarChar, Shift_ID)
      .query("SELECT * FROM LOT_Shift_Details WHERE Shift_ID = @Shift_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function UpdateLotGamesDetails(itemData) {
  console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keys
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[LOT_Games_Details]
          SET ${setQueryParts.join(", ")}
          WHERE [Game_ID] = @Game_ID AND [Shift_ID] = @Shift_ID;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Add input parameters dynamically, with conditional handling of types
      if (key === "Stock_Level_Open" || key === "Stock_Level_Close") {
        request.input(key, sql.Int, itemData[key]);
      } else if (
        key === "Shift_ID" ||
        key === "Shift_Open_Serial" ||
        key === "Shift_Close_Serial" ||
        key === "Location" ||
        key === "Active_Book"
      ) {
        request.input(key, sql.NVarChar, itemData[key]);
      } else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating LOT_Games_Details");
  }
}

async function UpdateShiftDetails(itemData) {
  console.log(itemData);

  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keys
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[LOT_Shift_Details]
          SET ${setQueryParts.join(", ")}
          WHERE [Shift_ID] = @Shift_ID;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type for each column
      if (key === "Shift_Start_Time" || key === "Shift_End_Time") {
        request.input(key, sql.DateTime, itemData[key]);
      } else if (key === "Shift_Status") {
        request.input(key, sql.Bit, itemData[key]);
      } else if (key === "Shift_ID" || key === "Shift_Cashier_ID") {
        request.input(key, sql.NVarChar(50), itemData[key]);
      } else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating LOT_Shift_Details");
  }
}

async function UpdateActivateBooks(itemData) {
  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keys
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[LOT_Activate_Books]
          SET ${setQueryParts.join(", ")}
          WHERE [ItemNum] = @ItemNum;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type for each column
      if (key === "Book_Created") {
        request.input(key, sql.DateTime, itemData[key]);
      } else if (key === "Book_Tickets") {
        request.input(key, sql.Int, itemData[key]);
      } else if (
        key === "Book_No" ||
        key === "CreatedBy" ||
        key === "Location" ||
        key === "ItemNum"
      ) {
        request.input(key, sql.NVarChar(50), itemData[key]);
      } else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    // Debugging: Log the result to check what gets returned
    console.log(result);

    // Return result to the calling function
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating LOT_Activate_Books");
  }
}

async function DeleteUnitTypes(ID) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ID", sql.NVarChar, ID)
      .query("DELETE FROM INV_Unit_Types WHERE ID = @ID");

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function get_Unit_Type(Unit_Type) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Unit_Type", sql.NVarChar, Unit_Type)
      .query("SELECT * FROM INV_Unit_Types WHERE Unit_Type = @Unit_Type");

    return result.recordset; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function get_All_Unit_Type() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM INV_Unit_Types");

    // Return the actual records, not just the rowsAffected
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function Create_Brand(brandData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[INV_Brands] (
              [ID], [Brand]
          ) VALUES (
              @ID, @Brand
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the brandData object and add each key-value pair as an input parameter
    for (let key in brandData) {
      request.input(key, sql.NVarChar, brandData[key]); // Adjust the type if needed for different fields
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}
async function get_Inventory_Brand_ID() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query("SELECT COALESCE(MAX(ID + 1), 1) AS MaxValue FROM INV_Brands");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_Lottery_Resaons(Reason_Type) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .query("SELECT * FROM LOT_Reason_Code WHERE Reason_Type = @Reason_Type");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function get_Lottery_Resaons_Exists(Reason_Type, Reason_Code) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .input("Reason_Code", sql.NVarChar, Reason_Code)
      .query(
        "SELECT * FROM LOT_Reason_Code WHERE Reason_Type = @Reason_Type AND Reason_Code = @Reason_Code"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_Each_Brand(Brand) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Brand", sql.NVarChar, Brand)
      .query("SELECT * FROM INV_Brands WHERE Brand = @Brand");

    return result.recordset; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function get_All_Brands() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM INV_Brands");

    // Return the actual records, not just the rowsAffected
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function DeleteBrand(ID) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ID", sql.NVarChar, ID)
      .query("DELETE FROM INV_Brands WHERE ID = @ID");

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function Create_SubCategory(subCategoryData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[INV_SubCategories] (
              [ID], [SubCategory]
          ) VALUES (
              @ID, @SubCategory
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the subCategoryData object and add each key-value pair as an input parameter
    for (let key in subCategoryData) {
      request.input(key, sql.NVarChar, subCategoryData[key]); // Adjust the type if needed for different fields
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}
async function Create_LotReasonCode(reasonCodeData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Reason_Code] (
              [Store_ID], [Reason_Code], [Reason_Type]
          ) VALUES (
              @Store_ID, @Reason_Code, @Reason_Type
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the reasonCodeData object and add each key-value pair as an input parameter
    for (let key in reasonCodeData) {
      if (reasonCodeData.hasOwnProperty(key)) {
        // Adjust the type if needed for different fields, here assuming nvarchar for string fields and smallint for Reason_Type
        if (key === "Reason_Type") {
          request.input(key, sql.SmallInt, reasonCodeData[key]);
        } else {
          request.input(key, sql.NVarChar, reasonCodeData[key]);
        }
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}

async function get_Inventory_SubCategory_ID() {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(
        "SELECT COALESCE(MAX(ID + 1), 1) AS MaxValue FROM INV_SubCategories"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function get_Each_SubCategory(SubCategory) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SubCategory", sql.NVarChar, SubCategory)
      .query(
        "SELECT * FROM INV_SubCategories WHERE SubCategory = @SubCategory"
      );

    return result.recordset; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function get_All_Category() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM INV_SubCategories");

    // Return the actual records, not just the rowsAffected
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function DeleteSubCategory(ID) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ID", sql.NVarChar, ID)
      .query("DELETE FROM INV_SubCategories WHERE ID = @ID");

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function DeleteReasonCode(Reason_Code, Reason_Type) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Reason_Code", sql.NVarChar, Reason_Code)
      .input("Reason_Type", sql.NVarChar, Reason_Type)
      .query(
        "DELETE FROM LOT_Reason_Code WHERE Reason_Code = @Reason_Code AND Reason_Type = @Reason_Type"
      );

    return result.rowsAffected[0] > 0; // Return true if a row was deleted
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function Create_Lot_Activated_Book_History(bookData) {
  try {
    // Connect to the database
    let pool = await sql.connect(config);

    // Define the SQL INSERT query with placeholders for parameters
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Activated_Book_History] (
              [Game_ID], [Book_No], [Book_Created], [Book_Tickets], 
              [CreatedBy], [Location], [ItemNum]
          ) VALUES (
              @Game_ID, @Book_No, @Book_Created, @Book_Tickets, 
              @CreatedBy, @Location, @ItemNum
          );
      `;

    // Create a request object to pass parameters
    let request = pool.request();

    // Loop over the bookData object and add each key-value pair as an input parameter
    for (let key in bookData) {
      request.input(key, sql.NVarChar, bookData[key]); // Adjust the type if needed for different fields
    }

    // Execute the query
    const response = await request.query(insertQuery);

    // Log the response (optional)
    console.log(response);
  } catch (error) {
    // Catch and log any errors
    console.log(error);
  }
}

async function Create_Lot_Permission(permissionData) {
  try {
    let pool = await sql.connect(config);

    // Define the SQL Insert query for LOT_Permission
    let insertQuery = `
          INSERT INTO [dbo].[LOT_Permission] (
              Emp_ID, Emp_Name, StartOrEndShift, ActivateBook, CreateNewGame, 
              OrganizeSlot, ViewShift, ResetShift
          ) VALUES (
              @Emp_ID, @Emp_Name, @StartOrEndShift, @ActivateBook, @CreateNewGame, 
              @OrganizeSlot, @ViewShift, @ResetShift
          );
      `;

    let request = pool.request();
    // Iterate over each key in permissionData and bind it to the request input parameters
    for (let key in permissionData) {
      // Assuming the fields are nvarchar(50) for Emp_ID and Emp_Name and bit for the other fields
      if (key === "Emp_ID" || key === "Emp_Name") {
        request.input(key, sql.NVarChar, permissionData[key]);
      } else {
        request.input(key, sql.Bit, permissionData[key]); // Assuming all boolean flags are of type 'bit'
      }
    }

    // Execute the query
    const response = await request.query(insertQuery);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function UpdateLotPermission(itemData) {
  try {
    let pool = await sql.connect(config);

    let setQueryParts = [];
    // Dynamically build the SET clause based on the provided itemData keysdsd
    for (let key in itemData) {
      setQueryParts.push(`[${key}] = @${key}`);
    }

    let updateQuery = `
          UPDATE [dbo].[LOT_Permission]
          SET ${setQueryParts.join(", ")}
          WHERE [Emp_ID] = @Emp_ID;
      `;

    let request = pool.request();

    // Add inputs dynamically based on itemData
    for (let key in itemData) {
      // Determine the appropriate SQL data type for each column
      if (key === "Emp_ID" || key === "Emp_Name") {
        request.input(key, sql.NVarChar, itemData[key]);
      } else if (
        key === "StartOrEndShift" ||
        key === "ActivateBook" ||
        key === "CreateNewGame" ||
        key === "OrganizeSlot" ||
        key === "ViewShift" ||
        key === "ResetShift"
      ) {
        request.input(key, sql.Bit, itemData[key]);
      } else {
        request.input(key, sql.NVarChar, itemData[key]); // Default to NVarChar for other fields
      }
    }

    const result = await request.query(updateQuery);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating LOT_Permission");
  }
}

async function get_Employee_Permission(Emp_ID) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("Emp_ID", sql.NVarChar, Emp_ID)
      .query("SElECT * FROM LOT_Permission WHERE Emp_ID = @Emp_ID");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  get_Employee_Permission: get_Employee_Permission,
  Create_Lot_Permission: Create_Lot_Permission,
  UpdateLotPermission: UpdateLotPermission,
  Create_Lot_Shift_Detail: Create_Lot_Shift_Detail,
  Create_Lot_Game_Detail: Create_Lot_Game_Detail,
  Create_Lot_Activate_Book: Create_Lot_Activate_Book,
  get_Shift_ID: get_Shift_ID,
  get_Game_Details: get_Game_Details,
  get_Shift_Details: get_Shift_Details,
  UpdateLotGamesDetails: UpdateLotGamesDetails,
  UpdateShiftDetails: UpdateShiftDetails,
  get_Shift_Book_Details: get_Shift_Book_Details,
  UpdateActivateBooks: UpdateActivateBooks,
  get_All_Shift_Details: get_All_Shift_Details,
  get_All_Shift_All_Games_Details: get_All_Shift_All_Games_Details,
  get_All_Games_Details: get_All_Games_Details,
  get_Inventory_UnitTypes_ID: get_Inventory_UnitTypes_ID,
  Create_Unit_Type: Create_Unit_Type,
  DeleteUnitTypes: DeleteUnitTypes,
  get_Unit_Type: get_Unit_Type,
  get_All_Unit_Type: get_All_Unit_Type,
  Create_Brand: Create_Brand,
  get_Inventory_Brand_ID: get_Inventory_Brand_ID,
  get_Each_Brand: get_Each_Brand,
  get_All_Brands: get_All_Brands,
  DeleteBrand: DeleteBrand,
  Create_SubCategory: Create_SubCategory,
  get_Inventory_SubCategory_ID: get_Inventory_SubCategory_ID,
  get_Each_SubCategory: get_Each_SubCategory,
  get_All_Category: get_All_Category,
  DeleteSubCategory: DeleteSubCategory,
  Create_LotReasonCode: Create_LotReasonCode,
  DeleteReasonCode: DeleteReasonCode,
  get_Lottery_Resaons: get_Lottery_Resaons,
  get_Lottery_Resaons_Exists: get_Lottery_Resaons_Exists,
  get_All_Book_Details: get_All_Book_Details,
  Create_Lot_Activated_Book_History: Create_Lot_Activated_Book_History,
  get_all_book_history_detail: get_all_book_history_detail,
};
