require("dotenv").config();
const dboperations = require("./Api/Lottery/Operations/LOT_Qureries");
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
var router = express.Router();
const PORT = 9090;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  next();
});

router.route("/createshiftdetail").post((request, response) => {
  let shiftData = { ...request.body };

  // Check if the shiftData is provided
  if (!shiftData || Object.keys(shiftData).length === 0) {
    return response.status(400).json({
      message: "Shift details are required.",
    });
  }

  // Assuming `dboperations.Create_Lot_Shift_Detail` is an async function that returns a Promise
  dboperations
    .Create_Lot_Shift_Detail(shiftData)
    .then((result) => {
      // If the shift detail creation is successful, send a 201 response
      response.status(201).json({
        message: "Shift detail created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating shift detail:", error);
      response.status(500).json({
        message: "An error occurred while creating the shift detail.",
        error: error.message || error,
      });
    });
});
router.route("/creategamedetail").post((request, response) => {
  let gameData = { ...request.body };

  // Check if the gameData is provided
  if (!gameData || Object.keys(gameData).length === 0) {
    return response.status(400).json({
      message: "Game details are required.",
    });
  }

  // Assuming `dboperations.Create_Lot_Game_Detail` is an async function that returns a Promise
  dboperations
    .Create_Lot_Game_Detail(gameData)
    .then((result) => {
      // If the game detail creation is successful, send a 201 response
      response.status(201).json({
        message: "Game detail created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating game detail:", error);
      response.status(500).json({
        message: "An error occurred while creating the game detail.",
        error: error.message || error,
      });
    });
});

router.route("/createunittype").post((request, response) => {
  let unitTypeData = { ...request.body };

  // Check if the unitTypeData is provided
  if (!unitTypeData || Object.keys(unitTypeData).length === 0) {
    return response.status(400).json({
      message: "Unit type details are required.",
    });
  }

  // Assuming `dboperations.Create_Unit_Type` is an async function that returns a Promise
  dboperations
    .Create_Unit_Type(unitTypeData)
    .then((result) => {
      // If the unit type creation is successful, send a 201 response
      response.status(201).json({
        message: "Unit type created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating unit type:", error);
      response.status(500).json({
        message: "An error occurred while creating the unit type.",
        error: error.message || error,
      });
    });
});
router.route("/GetUnitTypeID").get((request, response) => {
  dboperations.get_Inventory_UnitTypes_ID().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetUnitDetails/:Unit_Type").get((request, response) => {
  dboperations.get_Unit_Type(request.params.Unit_Type).then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllUnits").get((request, response) => {
  dboperations
    .get_All_Unit_Type()
    .then((result) => {
      // Send the result (unit types) as JSON
      response.json(result);
    })
    .catch((error) => {
      // Handle error if the database query fails
      response.status(500).json({ error: "Internal Server Error" });
    });
});
router.route("/DeleteUnitType/:ID").delete(async (request, response) => {
  const { ID } = request.params;
  try {
    const result = await dboperations.DeleteUnitTypes(ID);
    if (result) {
      response
        .status(200)
        .json({ success: true, message: "Item deleted successfully" });
    } else {
      response.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.route("/createbrand").post((request, response) => {
  let brandData = { ...request.body };

  // Check if the brandData is provided
  if (!brandData || Object.keys(brandData).length === 0) {
    return response.status(400).json({
      message: "Brand details are required.",
    });
  }

  // Assuming `dboperations.Create_Brand` is an async function that returns a Promise
  dboperations
    .Create_Brand(brandData)
    .then((result) => {
      // If the brand creation is successful, send a 201 response
      response.status(201).json({
        message: "Brand created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating brand:", error);
      response.status(500).json({
        message: "An error occurred while creating the brand.",
        error: error.message || error,
      });
    });
});
router.route("/GetBrandID").get((request, response) => {
  dboperations.get_Inventory_Brand_ID().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetBrandDetails/:Brand").get((request, response) => {
  dboperations.get_Each_Brand(request.params.Brand).then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllBrands").get((request, response) => {
  dboperations
    .get_All_Brands()
    .then((result) => {
      // Send the result (unit types) as JSON
      response.json(result);
    })
    .catch((error) => {
      // Handle error if the database query fails
      response.status(500).json({ error: "Internal Server Error" });
    });
});
router.route("/DeleteBrand/:ID").delete(async (request, response) => {
  const { ID } = request.params;
  try {
    const result = await dboperations.DeleteBrand(ID);
    if (result) {
      response
        .status(200)
        .json({ success: true, message: "Item deleted successfully" });
    } else {
      response.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.route("/createsubcategory").post((request, response) => {
  let subCategoryData = { ...request.body };

  // Check if the subCategoryData is provided
  if (!subCategoryData || Object.keys(subCategoryData).length === 0) {
    return response.status(400).json({
      message: "SubCategory details are required.",
    });
  }

  // Assuming `dboperations.Create_SubCategory` is an async function that returns a Promise
  dboperations
    .Create_SubCategory(subCategoryData)
    .then((result) => {
      // If the subcategory creation is successful, send a 201 response
      response.status(201).json({
        message: "SubCategory created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating subcategory:", error);
      response.status(500).json({
        message: "An error occurred while creating the subcategory.",
        error: error.message || error,
      });
    });
});
router.route("/createreasoncode").post((request, response) => {
  let reasonCodeData = { ...request.body };

  // Check if the reasonCodeData is provided
  if (!reasonCodeData || Object.keys(reasonCodeData).length === 0) {
    return response.status(400).json({
      message: "Reason Code details are required.",
    });
  }

  // Assuming `dboperations.Create_LotReasonCode` is an async function that returns a Promise
  dboperations
    .Create_LotReasonCode(reasonCodeData)
    .then((result) => {
      // If the reason code creation is successful, send a 201 response
      response.status(201).json({
        message: "Reason Code created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating reason code:", error);
      response.status(500).json({
        message: "An error occurred while creating the reason code.",
        error: error.message || error,
      });
    });
});
router.route("/GetLotteryReasonCode/:Reason_Type").get((request, response) => {
  dboperations
    .get_Lottery_Resaons(request.params.Reason_Type)
    .then((result) => {
      response.json(result[0]);
    });
});
router
  .route("/GetCheckExist/:Reason_Type/:Reason_Code")
  .get((request, response) => {
    dboperations
      .get_Lottery_Resaons_Exists(
        request.params.Reason_Type,
        request.params.Reason_Code
      )
      .then((result) => {
        response.json(result[0]);
      });
  });
router
  .route("/DeleteReasonCode/:Reason_Code/:Reason_Type")
  .delete(async (request, response) => {
    const { Reason_Code, Reason_Type } = request.params;
    try {
      const result = await dboperations.DeleteReasonCode(
        Reason_Code,
        Reason_Type
      );
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
router.route("/GetSubCategoryID").get((request, response) => {
  dboperations.get_Inventory_Brand_ID().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetSubCategory/:SubCategory").get((request, response) => {
  dboperations.get_Each_SubCategory(request.params.Brand).then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllSubCategories").get((request, response) => {
  dboperations
    .get_All_Category()
    .then((result) => {
      // Send the result (unit types) as JSON
      response.json(result);
    })
    .catch((error) => {
      // Handle error if the database query fails
      response.status(500).json({ error: "Internal Server Error" });
    });
});
router.route("/DeleteSubCategory/:ID").delete(async (request, response) => {
  const { ID } = request.params;
  try {
    const result = await dboperations.DeleteSubCategory(ID);
    if (result) {
      response
        .status(200)
        .json({ success: true, message: "Item deleted successfully" });
    } else {
      response.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.route("/createactivatebook").post((request, response) => {
  let bookData = { ...request.body };

  // Check if the bookData is provided
  if (!bookData || Object.keys(bookData).length === 0) {
    return response.status(400).json({
      message: "Book details are required.",
    });
  }

  // Assuming `dboperations.Create_Lot_Activate_Book` is an async function that returns a Promise
  dboperations
    .Create_Lot_Activate_Book(bookData)
    .then((result) => {
      // If the book creation is successful, send a 201 response
      response.status(201).json({
        message: "Book activated successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error activating book:", error);
      response.status(500).json({
        message: "An error occurred while activating the book.",
        error: error.message || error,
      });
    });
});
router.route("/GetShiftID").get((request, response) => {
  dboperations.get_Shift_ID().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllGames").get((request, response) => {
  dboperations.get_All_Games_Details().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllShift").get((request, response) => {
  dboperations.get_All_Shift_Details().then((result) => {
    response.json(result[0]);
  });
});
router.route("/GetAllShiftAllGames/:Shift_ID").get((request, response) => {
  dboperations
    .get_All_Shift_All_Games_Details(request.params.Shift_ID)
    .then((result) => {
      response.json(result[0]);
    });
});
router.route("/GetGameDetails/:Shift_ID/:Location").get((request, response) => {
  dboperations
    .get_Game_Details(request.params.Shift_ID, request.params.Location)
    .then((result) => {
      response.json(result[0]);
    });
});
router
  .route("/GetShiftBookTickets/:ItemNum/:Location")
  .get((request, response) => {
    dboperations
      .get_Shift_Book_Details(request.params.ItemNum, request.params.Location)
      .then((result) => {
        response.json(result[0]);
      });
  });
router.route("/GetAllHistoryDetails/:ItemNum").get((request, response) => {
  dboperations
    .get_all_book_history_detail(request.params.ItemNum)
    .then((result) => {
      response.json(result[0]);
    });
});
router.route("/GetEmployeePermission/:Emp_ID").get((request, response) => {
  dboperations.get_Employee_Permission(request.params.Emp_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/createlotpermission").post((request, response) => {
  let permissionDetails = { ...request.body };

  // Check if the permissionDetails are provided
  if (!permissionDetails || Object.keys(permissionDetails).length === 0) {
    return response.status(400).json({
      message: "Permission details are required.",
    });
  }

  // Assuming `dboperations.Create_Lot_Permission` is an async function that returns a Promise
  dboperations
    .Create_Lot_Permission(permissionDetails)
    .then((result) => {
      // If the permission creation is successful, send a 201 response
      response.status(201).json({
        message: "Permission created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating permission:", error);
      response.status(500).json({
        message: "An error occurred while creating the permission.",
        error: error.message || error,
      });
    });
});

router.route("/updatelotpermission").put((request, response) => {
  let lotPermissionDetails = { ...request.body };

  dboperations
    .UpdateLotPermission(lotPermissionDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      // console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "LOT Permission updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "LOT Permission not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating LOT Permission:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the LOT Permission",
        error: error.message,
      });
    });
});

router.route("/GetAllActiveBooks").get((request, response) => {
  dboperations.get_All_Book_Details().then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetShiftDetails/:Shift_ID").get((request, response) => {
  dboperations.get_Shift_Details(request.params.Shift_ID).then((result) => {
    response.json(result[0]);
  });
});
router.route("/updatelotgamesdetails").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdateLotGamesDetails(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "Game details updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Game details not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating game details:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the game details",
        error: error.message,
      });
    });
});
router.route("/updateshiftdetails").put((request, response) => {
  let shiftDetails = { ...request.body };

  dboperations
    .UpdateShiftDetails(shiftDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "Shift details updated successfully" });
      } else {
        // If no rows were affected (no matching shift or no changes made)
        response
          .status(404)
          .json({ message: "Shift details not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating shift details:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the shift details",
        error: error.message,
      });
    });
});
router.route("/updateactivatebooks").put((request, response) => {
  let bookDetails = { ...request.body };

  dboperations
    .UpdateActivateBooks(bookDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "Book details updated successfully" });
      } else {
        // If no rows were affected (no matching book or no changes made)
        response
          .status(404)
          .json({ message: "Book details not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating book details:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the book details",
        error: error.message,
      });
    });
});

router.route("/createactivatedbookhistory").post((request, response) => {
  let bookData = { ...request.body };

  // Check if the bookData is provided
  if (!bookData || Object.keys(bookData).length === 0) {
    return response.status(400).json({
      message: "Book history details are required.",
    });
  }

  // Assuming `dboperations.Create_Lot_Activated_Book_History` is an async new function that returns a Promise
  dboperations
    .Create_Lot_Activated_Book_History(bookData)
    .then((result) => {
      // If the book history creation is successful, send a 201 response
      response.status(201).json({
        message: "Book history created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating book history:", error);
      response.status(500).json({
        message: "An error occurred while creating the book history.",
        error: error.message || error,
      });
    });
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/inventory`);
  if (process.send) process.send({ status: "started", port: PORT });
});

process.on("SIGTERM", () => {
  server.close(() => console.log("Server shutting down"));
});
